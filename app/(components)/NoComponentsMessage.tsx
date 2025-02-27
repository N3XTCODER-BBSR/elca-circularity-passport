import Image from "next/image"
import { CtaButton } from "./generic/CtaButton"

export const NoComponentsMessage = () => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <Image src="/missing_components.svg" width={82} height={93} className="w-20" alt="missing components" />
      <div className="flex flex-col items-center gap-2 text-gray-900">
        <h3 className="text-2xl font-semibold leading-8">No relevant building components found</h3>
        <p className="max-w-[44.5rem] text-center text-lg font-normal leading-8">
          The circularity index is calculated for building components in the cost groups: 320, 330, 340, 350 and 360.
          Please go to eLCA and add building components in one of these groups to get started.
        </p>
      </div>
      <CtaButton href="http://localhost:8000" text="Start Adding Components in eLCA" />
    </div>
  )
}
