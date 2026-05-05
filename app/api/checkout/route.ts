import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY!
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID!
const PRO_VARIANT_ID = process.env.LEMONSQUEEZY_PRO_VARIANT_ID!
const ISEP_VARIANT_ID = process.env.LEMONSQUEEZY_ISEP_VARIANT_ID!

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: 'pro' | 'isep' }
  const variantId = plan === 'isep' ? ISEP_VARIANT_ID : PRO_VARIANT_ID

  // Build base URL from request (origin can be null for same-origin server requests)
  const host = req.headers.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: user.email,
          custom: { user_id: user.id },
        },
        product_options: {
          redirect_url: `${baseUrl}/app?upgraded=1`,
        },
      },
      relationships: {
        store: { data: { type: 'stores', id: STORE_ID } },
        variant: { data: { type: 'variants', id: variantId } },
      },
    },
  }

  console.log('Checkout request → variant', variantId, 'store', STORE_ID)

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${LS_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  const responseText = await res.text()

  if (!res.ok) {
    console.error('Lemon Squeezy error', res.status, responseText)
    return NextResponse.json(
      { error: `Checkout failed (${res.status})`, detail: responseText },
      { status: 500 }
    )
  }

  const data = JSON.parse(responseText)
  const checkoutUrl: string | undefined = data.data?.attributes?.url

  console.log('Checkout URL:', checkoutUrl)
  return NextResponse.json({ url: checkoutUrl })
}
