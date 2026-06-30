'use server'

import { writeClient } from '@/sanity/lib/client'

export type CombinedState = {
  success: boolean
  attending?: boolean
  error?: string
} | null

export async function submitAll(prevState: CombinedState, formData: FormData): Promise<CombinedState> {
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const attending = formData.get('attending') === 'true'
  const guestCount = Number(formData.get('guestCount')) || 1
  const message = (formData.get('message') as string)?.trim()

  if (!name) {
    return { success: false, error: 'Vui lòng nhập họ và tên' }
  }

  try {
    await writeClient.create({
      _type: 'rsvp',
      name,
      phone: phone || '',
      attending,
      guestCount,
      submittedAt: new Date().toISOString(),
    })

    if (message) {
      await writeClient.create({
        _type: 'guestbook',
        authorName: name,
        message,
        submittedAt: new Date().toISOString(),
        approved: false,
      })
    }

    return { success: true, attending }
  } catch {
    return { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại' }
  }
}
