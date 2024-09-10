"use server"

import { notFound } from "next/navigation"
import { getDinEnrichedPassportData } from "app/[locale]/(web-optimized)/[passportId]/(utils)/getPassportData"
import BuildingInformation from "./BuildingInformation"
import CircularityModule from "./CircularityModule"
import Footer from "./Footer"
import MaterialsModule from "./MaterialsModule/MaterialsModule"
import ResourcesModule from "./ResourcesModule"

const Page = async ({ params }: { params: { passportId: string } }) => {
  const dinEnrichedPassportData = await getDinEnrichedPassportData(params.passportId)

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
        <ResourcesModule
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          nrf={dinEnrichedPassportData.buildingBaseData.nrf}
          className="mt-16"
        />
        <CircularityModule
          dinEnrichedBuildingComponents={dinEnrichedPassportData.dinEnrichedBuildingComponents}
          className="mt-16"
        />
      </div>
      {/* <div className="h-[15mm] bg-gray-600 p-[7mm] text-white"> */}
      <Footer passportData={dinEnrichedPassportData} />
    </>

    // <div className="min-w-full">
    // <div className="w-[210mm]">
    //   <div className="h-[15mm] bg-gray-600 py-[2mm] text-white">
    //     <h1 className="ml-3 leading-none tracking-tight">
    //       <div className="font-normal">Ressourcenpass für Gebäude</div>
    //       <div className="mt-[1.5mm] font-bold">{dinEnrichedPassportData.projectName}</div>
    //     </h1>
    //   </div>
    //   <div className="h-[267mm] bg-white ml-3 p-[0mm] ">
    //     <div>
    //     <h2 className="mt-[1.5mm] font-semibold uppercase">Gebäudeinfo</h2>
    //     {/* <BuildingInformation dinEnrichedPassportData={dinEnrichedPassportData} /> */}
    //     </div>
    //   </div>
    //   <div className="h-[15mm] bg-gray-600 p-[7mm] text-white"></div>
    //   {/* <div className="absolute h-2/4 w-2/4">
    //     <MaterialsBarChart data={chartData} />
    //     FOO
    //   </div> */}
    // </div>
  )
}

export default Page
