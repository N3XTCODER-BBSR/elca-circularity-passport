import { MenuItem as HeadlessUiMenuItem, Menu, MenuItems } from "@headlessui/react"
import Link from "next/link"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

export type MenuItem = {
  testId?: string
  text: string
  handleOnClick?: () => void
  href?: string
}

const NavBarDropdownMenu: FC<{ menuButton: React.ReactNode; items: MenuItem[]; className?: string }> = ({
  menuButton,
  items,
  className,
}) => {
  return (
    <Menu as="div" className={twMerge("relative ml-3", className)}>
      <div>{menuButton}</div>
      <MenuItems
        className="absolute right-0 z-10 mt-2 w-44 origin-top-right scale-95 
                     rounded-md bg-white py-1 opacity-0 shadow-lg ring-1 
                     ring-black ring-opacity-5 transition focus:outline-none data-[open]:scale-100 
                     data-[open]:opacity-100"
      >
        {items.map((item) => {
          const itemContent = item.href ? (
            <Link href={item.href} className="block px-4 py-2 text-sm text-gray-700" data-testid={item.testId}>
              {item.text}
            </Link>
          ) : (
            <button
              onClick={item.handleOnClick}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700"
              data-testid={item.testId}
            >
              {item.text}
            </button>
          )

          return <HeadlessUiMenuItem key={item.text}>{itemContent}</HeadlessUiMenuItem>
        })}
      </MenuItems>
    </Menu>
  )
}

export default NavBarDropdownMenu
