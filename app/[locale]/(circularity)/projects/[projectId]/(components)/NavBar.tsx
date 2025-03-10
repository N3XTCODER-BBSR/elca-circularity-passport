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
"use client"

import { Disclosure } from "@headlessui/react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { FC } from "react"
import BackButton from "app/(components)/generic/BackButton"
import NavBarDropdownMenu from "app/(components)/generic/NavBarMenuDropdown"
import LanguageDropdown from "app/(components)/LanguageDropdown"
import NavBarProfileDropdown from "app/[locale]/(circularity)/(components)/NavBarProfileDropdown"
import MobileMenuButton from "./MobileMenuButton"
import MobileMenuPanel from "./MobileMenuPanel"
import NavigationLinks from "./NavigationLinks"
import ProjectInfo from "./ProjectVariantInfo"
import ProjectVariantInfo from "./ProjectVariantInfo"

type ProjectInfo = {
  projectName: string
  variantName: string
  projectId: number
}

const NavBar: FC<{
  projectInfo?: ProjectInfo
  showAvatar?: boolean
  backButtonTo?: string
  navLinks?: { id: string; name: string; href: string }[]
}> = ({ projectInfo, showAvatar, backButtonTo, navLinks }) => {
  const router = useRouter()

  const t = useTranslations("Grp.Web.NavBar")

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="relative flex h-16 justify-between">
              {/* Mobile menu button */}
              {navLinks && <MobileMenuButton open={open} />}

              {backButtonTo && (
                <div className="flex items-center">
                  <BackButton handleOnClick={() => router.push(backButtonTo)} text={t("back")} />
                </div>
              )}
              {/* Navigation Links */}
              {navLinks && <NavigationLinks navigation={navLinks} />}

              <div className="flex-1" />

              {/* Right Side: Project Info and Profile */}
              <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <LanguageDropdown />
                {projectInfo && (
                  <NavBarDropdownMenu
                    className="mr-4"
                    menuButton={
                      <ProjectVariantInfo projectName={projectInfo.projectName} variantName={projectInfo.variantName} />
                    }
                    items={[
                      { text: t("switchProject"), href: "/projects" },
                      {
                        text: t("switchVariant"),
                        href: `/projects/${projectInfo.projectId}/variants`,
                      },
                    ]}
                  />
                )}
                {showAvatar && <NavBarProfileDropdown />}
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {navLinks && <MobileMenuPanel open={open} navigation={navLinks} />}
        </>
      )}
    </Disclosure>
  )
}

export default NavBar
