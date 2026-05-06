import { NextRequest, NextResponse } from 'next/server'

const MAX_PDF_SIZE = 60 * 1024 * 1024 // 60 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json({ error: 'File too large (max 60 MB)' }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Dynamic import to avoid issues with server components
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)

    return NextResponse.json({ text: data.text })
  } catch (err) {
    console.error('PDF extraction error:', err)
    return NextResponse.json({ error: 'Failed to extract PDF' }, { status: 500 })
  }
}
