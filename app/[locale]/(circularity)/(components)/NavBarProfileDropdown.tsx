import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { signOut, useSession } from "next-auth/react"
import { twMerge } from "tailwind-merge"

const NavBarProfileDropdown = ({ additionalMenuItems }: { additionalMenuItems?: React.ReactNode }) => {
  const { data: session } = useSession()

  if (session == null) {
    return null
  }

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton
          className="relative flex rounded-full bg-white text-sm 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       focus:ring-offset-2"
          data-testid="profile-dropdown-button"
        >
          <span className="absolute -inset-1.5" aria-hidden="true" />
          <span className="sr-only">Open user menu</span>
          <img alt="User avatar" src="/user_profile_placeholder.svg" className="size-8 rounded-full" />
        </MenuButton>
      </div>
      <MenuItems
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right scale-95 
                     rounded-md bg-white py-1 opacity-0 shadow-lg ring-1 
                     ring-black ring-opacity-5 transition focus:outline-none data-[open]:scale-100 
                     data-[open]:opacity-100"
      >
        {additionalMenuItems}
        <MenuItem>
          <button
            onClick={() => signOut()}
            className={twMerge("block px-4 py-2 text-sm text-gray-700")}
            data-testid="logout-button"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

export default NavBarProfileDropdown
