interface SectionHeaderProps {
  eyebrow: string
  title: string
  ornament?: string
  dark?: boolean
}

export default function SectionHeader({ eyebrow, title, ornament = '❧', dark = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <p className={`section-subtitle ${dark ? '!text-cream/40' : ''}`}>{eyebrow}</p>
      <h2 className={`section-title ${dark ? '!text-cream' : ''}`}>{title}</h2>
      <div className="divider-ornament mt-6">
        <span className="text-gold text-xl">{ornament}</span>
      </div>
    </div>
  )
}
