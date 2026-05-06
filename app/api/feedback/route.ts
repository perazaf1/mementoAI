import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildCoursePrompt, buildCodePrompt } from '@/lib/claude'
import { createClient } from '@/utils/supabase/server'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'

const anthropic = new Anthropic()

const SESSION_LIMITS: Record<string, number> = {
  free: 3,
  pro: 20,
  isep: 10,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: max 10 requests per minute per user
    const { allowed } = rateLimit(user.id, { maxRequests: 10, windowMs: 60_000 })
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Atomically consume a session (handles reset + limit check in one locked DB call)
    const { data: consumeResult, error: consumeError } = await supabaseAdmin
      .rpc('try_consume_session', { p_user_id: user.id })

    if (consumeError) {
      console.error('try_consume_session error:', consumeError)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (consumeResult === 'user_not_found') {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (consumeResult === 'limit_reached') {
      // Fetch plan info for the response
      const { data: profile } = await supabaseAdmin
        .from('users')
        .select('plan, sessions_today')
        .eq('id', user.id)
        .single()
      const plan = profile?.plan ?? 'free'
      const limit = SESSION_LIMITS[plan] ?? SESSION_LIMITS.free
      return NextResponse.json(
        { error: 'session_limit_reached', limit, plan },
        { status: 429 }
      )
    }

    // Parse request
    const { courseText, transcript, feedbackLang = 'auto', mode = 'course' } = await req.json()

    if (!courseText || !transcript) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { system, userMessage } = mode === 'code'
      ? buildCodePrompt(courseText, transcript)
      : buildCoursePrompt(courseText, transcript, feedbackLang)

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userMessage }],
    })

    const feedback = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    // Fetch updated session count for the response + save recitation (in parallel)
    const [{ data: updatedProfile }] = await Promise.all([
      supabaseAdmin.from('users').select('plan, sessions_today').eq('id', user.id).single(),
      supabaseAdmin.from('recitations').insert({
        user_id: user.id,
        mode,
        course_text: courseText,
        transcript,
        feedback,
      }),
    ])

    const plan = updatedProfile?.plan ?? 'free'
    const sessionsUsed = updatedProfile?.sessions_today ?? 1
    const limit = SESSION_LIMITS[plan] ?? SESSION_LIMITS.free

    return NextResponse.json({
      feedback,
      sessionsUsed,
      sessionsLimit: limit,
    })
  } catch (err) {
    console.error('Feedback API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
