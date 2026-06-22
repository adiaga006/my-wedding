import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, attending, guestCount, note } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
    }

    await writeClient.create({
      _type: 'rsvp',
      name: name.trim(),
      phone: phone.trim(),
      attending: Boolean(attending),
      guestCount: Number(guestCount) || 1,
      note: note?.trim() || '',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ error: 'Có lỗi xảy ra, vui lòng thử lại' }, { status: 500 })
  }
}
