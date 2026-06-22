import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { authorName, message } = body

    if (!authorName || !message) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'guestbook',
      authorName: authorName.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      approved: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Guestbook error:', err)
    return NextResponse.json({ error: 'Có lỗi xảy ra, vui lòng thử lại' }, { status: 500 })
  }
}
