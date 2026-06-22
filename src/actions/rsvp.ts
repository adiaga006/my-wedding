'use server'

import { writeClient } from '@/sanity/lib/client'

export type RSVPState = {
  success: boolean
  attending?: boolean
  error?: string
} | null

export async function submitRSVP(prevState: RSVPState, formData: FormData): Promise<RSVPState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const attending = formData.get('attending') === 'true'
  const guestCount = Number(formData.get('guestCount')) || 1
  const note = (formData.get('note') as string)?.trim() || ''

  if (!name || !phone) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin' }
  }

  try {
    await writeClient.create({
      _type: 'rsvp',
      name,
      phone,
      attending,
      guestCount,
      note,
      submittedAt: new Date().toISOString(),
    })
    return { success: true, attending }
  } catch {
    return { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại' }
  }
}
