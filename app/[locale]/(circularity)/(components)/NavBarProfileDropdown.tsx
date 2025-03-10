/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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
