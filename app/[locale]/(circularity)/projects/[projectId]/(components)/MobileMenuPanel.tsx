import { DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { usePathname } from "i18n/routing"
import { twMerge } from "tailwind-merge"

type MobileMenuPanelProps = {
  open: boolean
  navigation: { id: string; name: string; href: string }[]
}

const MobileMenuPanel = ({ open, navigation }: MobileMenuPanelProps) => {
  const pathname = usePathname()

  return open ? (
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 pb-4 pt-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className={twMerge(
                isActive
                  ? "border-bbsr-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700",
                "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.name}
            </DisclosureButton>
          )
        })}
      </div>
    </DisclosurePanel>
  ) : null
}

export default MobileMenuPanel
