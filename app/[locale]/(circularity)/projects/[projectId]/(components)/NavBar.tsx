"use client"

import { Disclosure } from "@headlessui/react"
import { FC, useEffect, useState } from "react"
import { ElcaProjectInfo } from "lib/domain-logic/types/domain-types"
import MobileMenuButton from "./MobileMenuButton"
import MobileMenuPanel from "./MobileMenuPanel"
import NavigationLinks from "./NavigationLinks"
import ProfileSection from "./ProfileSection"
import ProjectInfo from "./ProjectInfo"

const NavBar: FC<{
  projectInfo?: ElcaProjectInfo
  showAvatar?: boolean
  showBackButton?: boolean
  navLinks?: { id: string; name: string; href: string }[]
}> = ({ projectInfo, showAvatar, showBackButton, navLinks }) => {
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
          <div className="mx-auto max-w-7xl">
            <div className="relative flex h-16 justify-between">
              {/* Mobile menu button */}
              {navLinks && <MobileMenuButton open={open} />}

              {/* Navigation Links */}
              {navLinks && <NavigationLinks navigation={navLinks} curNaviElIdx={curNaviElIdx} />}

              <div className="flex-1" />

              {/* Right Side: Project Info and Profile */}
              <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {projectInfo && <ProjectInfo projectName={projectInfo.project_name} />}
                {showAvatar && <ProfileSection />}
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {navLinks && <MobileMenuPanel open={open} navigation={navLinks} curNaviElIdx={curNaviElIdx} />}
        </>
      )}
    </Disclosure>
  )
}

export default NavBar
