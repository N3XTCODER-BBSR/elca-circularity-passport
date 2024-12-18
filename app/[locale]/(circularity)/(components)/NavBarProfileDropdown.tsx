import { MenuButton } from "@headlessui/react"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import React, { FC } from "react"
import NavBarDropdownMenu, { MenuItem } from "app/(components)/generic/NavBarMenuDropdown"

const NavBarProfileDropdown: FC = () => {
  const { data: session } = useSession()

  if (session === null) {
    return null
  }

  const menuButton = (
    <MenuButton className="relative flex rounded-full bg-white text-sm" data-testid="profile-dropdown-button">
      <span className="absolute -inset-1.5" aria-hidden="true" />
      <span className="sr-only">Open user menu</span>
      <Image
        alt="User avatar"
        src="/user_profile_placeholder.svg"
        width={128}
        height={129}
        className="size-8 rounded-full"
      />
    </MenuButton>
  )

  const items: MenuItem[] = [{ text: "Sign out", testId: "logout-button", handleOnClick: () => signOut() }]

  return <NavBarDropdownMenu items={items} menuButton={menuButton} />
}

export default NavBarProfileDropdown
