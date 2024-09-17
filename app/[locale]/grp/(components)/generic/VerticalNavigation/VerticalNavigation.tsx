import React from "react"
import { twMerge } from "tailwind-merge"

type NavigationItem = {
  name: string
  id: string
}

interface SidebarProps {
  navigation: NavigationItem[]
  currentSectionId: string
  onSelect: (name: string) => void
}

const VerticalNavigation: React.FC<SidebarProps> = ({ navigation, currentSectionId, onSelect }) => {
  return (
    <nav aria-label="Sidebar" className="flex flex-1 flex-col">
      <ul className="-mx-2 space-y-1">
        {navigation.map((item) => (
          <li key={item.id}>
            <a
              href={item.id}
              onClick={(e) => {
                e.preventDefault()
                onSelect(item.id)
                e.stopPropagation()
              }}
              className={twMerge(
                item.id === currentSectionId
                  ? "bg-gray-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "group flex cursor-pointer gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6"
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default VerticalNavigation
