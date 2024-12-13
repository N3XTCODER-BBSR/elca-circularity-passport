import Link from "next/link"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import NavBarProfileDropdown from "app/[locale]/(circularity)/(components)/NavBarProfileDropdown"

const ProfileSection: FC = () => (
  <NavBarProfileDropdown
    additionalMenuItems={
      <Link href={`/projects`} className={twMerge("block px-4 py-2 text-sm text-gray-700")}>
        Switch project
      </Link>
    }
  ></NavBarProfileDropdown>
)

export default ProfileSection
