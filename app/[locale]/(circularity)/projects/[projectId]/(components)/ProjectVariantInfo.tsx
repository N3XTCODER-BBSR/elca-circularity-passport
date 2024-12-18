"use client"

import { MenuButton } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { FC } from "react"

const ProjectVariantInfo: FC<{ projectName: string; variantName: string }> = ({ projectName, variantName }) => {
  return (
    <MenuButton>
      <div className="flex items-center gap-1.5">
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{projectName}</p>
          <p className="text-sm font-normal text-bbsr-blue-600">{variantName}</p>
        </div>
        <ChevronDownIcon className="size-5 text-bbsr-blue-600" />
      </div>
    </MenuButton>
  )
}

export default ProjectVariantInfo
