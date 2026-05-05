import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
const PRO_VARIANT_ID = process.env.LEMONSQUEEZY_PRO_VARIANT_ID!
const ISEP_VARIANT_ID = process.env.LEMONSQUEEZY_ISEP_VARIANT_ID!

function verifySignature(rawBody: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  const digest = hmac.update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName: string = payload.meta?.event_name ?? ''

  // Only handle active subscriptions
  if (eventName !== 'subscription_created' && eventName !== 'subscription_updated') {
    return NextResponse.json({ received: true })
  }

  const attrs = payload.data?.attributes
  const status: string = attrs?.status ?? ''
  const variantId: string = String(attrs?.variant_id ?? '')
  const userEmail: string = attrs?.user_email ?? ''
  const userId: string = payload.meta?.custom_data?.user_id ?? ''

  if (!userEmail && !userId) {
    console.error('Webhook: no user_email or user_id in payload')
    return NextResponse.json({ error: 'Missing user identifier' }, { status: 400 })
  }

  // Determine the new plan
  let newPlan: 'pro' | 'isep' | 'free' = 'free'
  if (status === 'active' || status === 'trialing') {
    if (variantId === ISEP_VARIANT_ID) newPlan = 'isep'
    else if (variantId === PRO_VARIANT_ID) newPlan = 'pro'
  }

  const supabase = await createClient()

  // Update by user_id (preferred) or fall back to email
  const query = supabase.from('users').update({ plan: newPlan })
  const { error } = userId
    ? await query.eq('id', userId)
    : await query.eq('email', userEmail)

  if (error) {
    console.error('Webhook: failed to update user plan', error)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`Webhook: user ${userId || userEmail} → plan ${newPlan}`)
  return NextResponse.json({ received: true })
}
