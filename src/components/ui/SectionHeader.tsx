import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  ornament?: string
  dark?: boolean
  icon?: ReactNode
}

export default function SectionHeader({ eyebrow, title, ornament = '❧', dark = false, icon }: SectionHeaderProps) {
  return (
    <div className="text-center mb-10 sm:mb-14 md:mb-16">
      {icon && (
        <div className={`flex justify-center mb-3 ${dark ? 'text-gold/70' : 'text-gold/80'}`}>
          {icon}
        </div>
      )}
      <p className={`section-subtitle ${dark ? '!text-cream/40' : ''}`}>{eyebrow}</p>
      <h2 className={`section-title ${dark ? '!text-cream' : ''}`}>{title}</h2>
      <div className="divider-ornament mt-6">
        <span className="text-gold text-xl">{ornament}</span>
      </div>
    </div>
  )
}
