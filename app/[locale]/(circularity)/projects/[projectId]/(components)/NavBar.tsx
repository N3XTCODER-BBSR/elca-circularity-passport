"use client"

import { Disclosure } from "@headlessui/react"
import { FC, useEffect, useState } from "react"
import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import MobileMenuButton from "./MobileMenuButton"
import MobileMenuPanel from "./MobileMenuPanel"
import NavigationLinks from "./NavigationLinks"
import ProfileSection from "./ProfileSection"
import ProjectInfo from "./ProjectInfo"

type NavBarProps = {
  projectInfo: ElcaProjectInfo
}

const NavBar: FC<NavBarProps> = ({ projectInfo }: NavBarProps) => {
  const nestedRootUrl = `/projects/${projectInfo.id}`

  const navigation = [
    { id: "overview", name: "Überblick", href: nestedRootUrl },
    { id: "catalog", name: "Katalog", href: `${nestedRootUrl}/catalog` },
  ]

  const [curNaviElIdx, setCurNaviElIdx] = useState<number>()

  // TODO: set currNaviElIdx based on path and:
  // 1. check whether there is more established/idomatic alternative solution than using useEffect as below
  // 2. also implement this then for the grp navbar for a passport
  useEffect(() => {
    // TODO: Implement
  }, [])

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-0">
            <div className="relative flex h-16 justify-between">
              {/* Mobile menu button */}
              <MobileMenuButton open={open} />

              {/* Navigation Links */}
              <NavigationLinks navigation={navigation} curNaviElIdx={curNaviElIdx} />

              {/* Right Side: Project Info and Profile */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ProjectInfo projectName={projectInfo.project_name} />
                <ProfileSection />
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <MobileMenuPanel open={open} navigation={navigation} curNaviElIdx={curNaviElIdx} />
        </>
      )}
    </Disclosure>
  )
}

export default NavBar
