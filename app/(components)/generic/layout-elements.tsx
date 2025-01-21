import { twMerge } from "tailwind-merge"

interface LayoutElementProps {
  children: React.ReactNode
  className?: string // optional className prop
}

export const StyledDd = ({ children, justifyEnd = false }: LayoutElementProps & { justifyEnd?: boolean }) => {
  return <dd className={`mt-1 flex items-center text-gray-600 ${justifyEnd ? "justify-end" : ""}`}>{children}</dd>
}
export const StyledDt = ({ children }: LayoutElementProps) => {
  return <dt className="flex items-center text-sm font-semibold leading-6 text-gray-700">{children}</dt>
}
export const Area = ({ children }: LayoutElementProps) => {
  return <div className="mb-4 bg-gray-50 px-4 py-3 sm:px-6">{children}</div>
}
export const TwoColGrid = ({ children }: LayoutElementProps) => {
  return <div className="sm:grid sm:grid-cols-2 sm:gap-4">{children}</div>
}
export const ThreeColGrid = ({ children }: LayoutElementProps) => {
  return <div className="sm:grid sm:grid-cols-3 sm:gap-4">{children}</div>
}

export const Badge = ({ children, color = "orange" }: LayoutElementProps & { color?: "green" | "orange" }) => {
  return (
    <div
      className={twMerge(
        `ml-4 flex h-[20px] items-center rounded-md px-4 py-1 text-xs font-medium`,
        color === "green" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
      )}
    >
      {children}
    </div>
  )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export const EditButton: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      className={`h-8 rounded-md bg-indigo-100 px-2.5 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// TEXT
export const Text = ({ children, className }: LayoutElementProps) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>
}

export const Heading3 = ({ children }: LayoutElementProps) => (
  <h3 className="mb-8 text-lg font-semibold leading-6 text-gray-900">{children}</h3>
)

export const Heading4 = ({ children }: LayoutElementProps) => (
  <h4 className="mb-8 text-base font-semibold leading-6 text-gray-900">{children}</h4>
)

export const ErrorText = ({ children, className }: LayoutElementProps) => (
  <span className={`text-sm text-error ${className}`}>{children}</span>
)

export const Required = ({ className }: { className?: string }) => (
  <span className={`pl-1 text-red ${className}`}> *</span>
)
