/**
 * Reusable layout components for PDF-optimized views
 */

export const ModuleContainer = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`module-container mb-8 ${className}`}>{children}</div>
)

export const ModuleTitle = ({ title }: { title: string }) => (
  <h2 className="mb-4 border-b border-gray-300 pb-2 text-lg font-semibold">{title}</h2>
)

export const ModuleSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`module-section mb-6 ${className}`}>{children}</div>
)

export const ModuleSectionTitle = ({ title }: { title: string }) => (
  <h3 className="mb-3 text-base font-medium">{title}</h3>
)
