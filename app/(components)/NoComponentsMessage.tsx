import Image from "next/image"
import { useTranslations } from "next-intl"

export const NoComponentsMessage = () => {
  const t = useTranslations("CircularityTool.sections.overview.noComponentsState")

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-8">
      <Image src="/missing_components.svg" width={82} height={93} className="w-20" alt="missing components" />
      <div className="flex flex-col items-center gap-2 text-gray-900">
        <h3 className="text-2xl font-semibold leading-8" data-testid="no-components-message__h3__heading">
          {t("title")}
        </h3>
        <p className="max-w-[44.5rem] text-center text-lg font-normal leading-8">{t("body")}</p>
      </div>
    </div>
  )
}
