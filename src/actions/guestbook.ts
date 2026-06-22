'use server'

import { writeClient } from '@/sanity/lib/client'

export type GuestbookState = {
  success: boolean
  authorName?: string
  message?: string
  error?: string
} | null

export async function submitGuestbook(prevState: GuestbookState, formData: FormData): Promise<GuestbookState> {
  const authorName = (formData.get('authorName') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!authorName || !message) {
    return { success: false, error: 'Vui lòng điền đầy đủ thông tin' }
  }

  try {
    await writeClient.create({
      _type: 'guestbook',
      authorName,
      message,
      submittedAt: new Date().toISOString(),
      approved: true,
    })
    return { success: true, authorName, message }
  } catch {
    return { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại' }
  }
}
