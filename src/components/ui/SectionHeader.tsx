interface SectionHeaderProps {
  eyebrow: string
  title: string
  ornament?: string
}

export default function SectionHeader({ eyebrow, title, ornament = '❧' }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <p className="section-subtitle">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <div className="divider-ornament mt-6">
        <span className="text-gold text-xl">{ornament}</span>
      </div>
    </div>
  )
}
