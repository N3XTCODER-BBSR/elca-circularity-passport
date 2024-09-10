// Module
export const ModuleContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[7pt]">{children}</div>
)
export const ModuleTitle = ({ title }: { title: string }) => (
  <h2 className="mb-[2.7mm] mt-[1.5mm] text-[8.64pt] font-semibold uppercase">{title}</h2>
)
export const ModuleMain = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-[4mm]">{children}</div>
)

// Module Section
export const ModuleSectionContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-0 flex-1">{children}</div>
)
export const ModuleSectionTitle = ({ title }: { title: string }) => {
  return <h2 className="mb-[2.71mm] bg-gray-200 px-[3mm] py-[1mm] text-[7.68pt] font-semibold">{title}</h2>
}
export const ModuleSectionMain = ({ children, height = 50 }: { children: React.ReactNode; height?: number }) => (
  <div className="flex-1">
    <div
      className={`flex gap-[1mm]`}
      style={{
        height: `${height}mm`,
      }}
    >
      {children}
    </div>
  </div>
)

export const Box = ({ children, height, isCol }: { children: React.ReactNode; height?: number; isCol?: boolean }) => (
  <div
    className={`flex flex-1 ${isCol ? "flex-col" : ""}`}
    style={{
      height: height ? `${height}mm` : "auto", // Apply height if passed, otherwise default to 'auto'
    }}
  >
    {children}
  </div>
)

// TEXT

export const TextXSLeading4 = ({
  children,
  light = false,
  semiBold = false,
}: {
  children: React.ReactNode
  light?: boolean
  semiBold?: boolean
}) => (
  <span className={`text-[5.76pt] ${light ? "text-gray-500" : "text-blue-gray-800"} ${semiBold && "font-semibold"}`}>
    {children}
  </span>
)
