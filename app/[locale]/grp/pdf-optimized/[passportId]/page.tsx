"use server"

import { notFound } from "next/navigation"
import BuildingInformation from "./BuildingInformation"
import CircularityModule from "./CircularityModule"
import Footer from "./Footer"
import MaterialsModule from "./MaterialsModule/MaterialsModule"
// import ResourcesModule from "./ResourcesModule"
import {
  ModuleContainer,
  ModuleMain,
  ModuleSectionContainer,
  ModuleSectionTitle,
  ModuleTitle,
} from "../(components)/layout-elements"
import { getDinEnrichedPassportDataByPassportUuid } from "../../../../../lib/domain-logic/grp/getPassportData"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportDataByPassportUuid(params.passportId)

  if (dinEnrichedPassportData == null) {
    notFound()
  }

  return (
    <>
      <div className="header h-[15mm] bg-gray-600 py-[2mm] text-white">
        <h1 className="mx-[5mm] pl-[2mm] pt-[1mm] leading-none tracking-tight">
          <div className="font-normal">Ressourcenpass für Gebäude</div>
          <div className="mt-[1.5mm] font-bold">{dinEnrichedPassportData.projectName}</div>
        </h1>
      </div>
      <div className="content mx-[5mm] box-border flex-1 overflow-hidden px-[2mm]">
        <BuildingInformation dinEnrichedPassportData={dinEnrichedPassportData} />
        <MaterialsModule dinEnrichedPassportData={dinEnrichedPassportData} />
        <ModuleContainer>
          <ModuleTitle title="Modul 2: Ressourcen" />

          <ModuleMain>
            <ModuleSectionContainer>
              <ModuleSectionTitle title="Under Construction: This module will be available in future releases" />
            </ModuleSectionContainer>
          </ModuleMain>
        </ModuleContainer>
        {/* <ResourcesModule
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          nrf={dinEnrichedPassportData.buildingBaseData.nrf}
        /> */}
        <CircularityModule
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          className="mt-16"
        />
      </div>
      <Footer passportData={dinEnrichedPassportData} />
    </>
  )
}

export default Page
