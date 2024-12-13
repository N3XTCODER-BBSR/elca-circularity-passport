import { DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { twMerge } from "tailwind-merge"

type MobileMenuPanelProps = {
  open: boolean
  navigation: { id: string; name: string; href: string }[]
  curNaviElIdx?: number
}

const MobileMenuPanel = ({ open, navigation, curNaviElIdx }: MobileMenuPanelProps) =>
  open && (
    <DisclosurePanel className="sm:hidden">
      <div className="space-y-1 pb-4 pt-2">
        {navigation.map((item, idx) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            className={twMerge(
              curNaviElIdx === idx
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700",
              "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
            )}
            aria-current={curNaviElIdx === idx ? "page" : undefined}
          >
            {item.name}
          </DisclosureButton>
        ))}
      </div>
    </DisclosurePanel>
  )

export default MobileMenuPanel
