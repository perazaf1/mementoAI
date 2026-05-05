import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildCoursePrompt, buildCodePrompt } from '@/lib/claude'
import { createClient } from '@/utils/supabase/server'

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

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('plan, sessions_today, last_reset_date')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Reset sessions if it's a new day
    const today = new Date().toISOString().split('T')[0]
    let sessionsToday = profile.sessions_today

    if (profile.last_reset_date !== today) {
      await supabase
        .from('users')
        .update({ sessions_today: 0, last_reset_date: today })
        .eq('id', user.id)
      sessionsToday = 0
    }

    // Check session limit
    const limit = SESSION_LIMITS[profile.plan] ?? SESSION_LIMITS.free
    if (sessionsToday >= limit) {
      return NextResponse.json(
        { error: 'session_limit_reached', limit, plan: profile.plan },
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
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: userMessage }],
    })

    const feedback = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n')

    // Save recitation + increment sessions (in parallel)
    await Promise.all([
      supabase.from('recitations').insert({
        user_id: user.id,
        mode,
        course_text: courseText,
        transcript,
        feedback,
      }),
      supabase
        .from('users')
        .update({ sessions_today: sessionsToday + 1 })
        .eq('id', user.id),
    ])

    return NextResponse.json({
      feedback,
      sessionsUsed: sessionsToday + 1,
      sessionsLimit: limit,
    })
  } catch (err) {
    console.error('Feedback API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
