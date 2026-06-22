import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TZ = 'Asia/Ho_Chi_Minh'

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  })
}

export function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  const datePart = date.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  })
  const timePart = date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TZ,
  })
  return { datePart, timePart }
}
