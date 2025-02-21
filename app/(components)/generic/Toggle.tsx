import { Switch } from "@headlessui/react"

const Toggle = ({
  disabled = false,
  isEnabled,
  setEnabled,
  label,
  testId,
}: {
  disabled?: boolean
  isEnabled: boolean
  setEnabled: () => void
  label: string
  testId?: string
}) => {
  const dataTestId = testId ? `toggle__switch__${testId}` : null

  return (
    <Switch
      disabled={disabled}
      checked={isEnabled}
      onChange={setEnabled}
      className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-bbsr-blue-600 focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed bg-gray-100 opacity-30" : "bg-gray-200 data-[checked]:bg-bbsr-blue-600"
      }`}
      data-testid={dataTestId}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
      />
    </Switch>
  )
}

export default Toggle
