import { twMerge } from "tailwind-merge"

type PdfTemplateProps = {
  children: React.ReactNode
  className?: string
}

export default function PdfTemplate({ children, className }: PdfTemplateProps) {
  return (
    <div className={twMerge("min-h-screen bg-white", className)}>
      <div className="mx-auto w-[210mm]">{children}</div>
    </div>
  )
}
