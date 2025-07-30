interface SectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Section({ title, subtitle, children, className = "" }: SectionProps) {
  return (
    <section className={`mt-8 ${className}`}>
      <h2 className="">{title}</h2>
      {subtitle && <h3 className="text-gray-600">{subtitle}</h3>}
      <div className="mt-4">{children}</div>
    </section>
  )
}
