// TODO: make DRY -> pdf-optimized components
export const Box = ({
  children,
  height,
  isCol,
  className = "",
}: {
  className?: string
  children: React.ReactNode
  height?: number
  isCol?: boolean
}) => (
  <div
    className={`flex flex-1 ${isCol ? "flex-col" : ""} ${className}`}
    style={{
      height: height ? `${height}mm` : "auto", // Apply height if passed, otherwise default to 'auto'
    }}
  >
    {children}
  </div>
)
