'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate))
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) return null

  const isPast = new Date(targetDate).getTime() <= Date.now()
  if (isPast) {
    return (
      <p className="font-serif text-xl sm:text-2xl italic text-cream/80 text-center">
        Hôm nay là ngày trọng đại của chúng tôi 🎊
      </p>
    )
  }

  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center justify-center">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center">
          <div className="text-center px-3 xs:px-4 sm:px-5 md:px-6">
            <div
              className="font-serif text-cream font-light leading-none tabular-nums"
              style={{ fontSize: 'clamp(1.75rem, 6vw, 3.5rem)' }}
            >
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="font-sans text-[9px] xs:text-[10px] tracking-widest uppercase text-cream/50 mt-2">
              {unit.label}
            </div>
          </div>
          {i < 3 && (
            <span className="font-serif text-xl xs:text-2xl sm:text-3xl text-cream/30 mb-5 select-none">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
