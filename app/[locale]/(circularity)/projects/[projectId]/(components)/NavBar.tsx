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
                  <BackButton handleOnClick={() => router.push(backButtonTo)} text="Back" />
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
