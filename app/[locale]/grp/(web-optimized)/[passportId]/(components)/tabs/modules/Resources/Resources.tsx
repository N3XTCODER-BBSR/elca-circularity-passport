// "use client"

// import { useTranslations } from "next-intl"
// import { useState } from "react"

// import VerticalNavigation from "app/[locale]/grp/(components)/generic/VerticalNavigation/VerticalNavigation"
// import { DinEnrichedBuildingComponent } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
// import Gwp from "./Gwp"
// import Penrt from "./Penrt"
// import Rmi from "./Rmi"

// type ResourcesProps = {
//   dinEnrichedBuildingComponents: DinEnrichedBuildingComponent[]
//   nrf: number
//   className?: string
// }

// const Resources: React.FC<ResourcesProps> = ({ dinEnrichedBuildingComponents, nrf, className }) => {
//   const t = useTranslations("Grp.Web.sections.overview.module2Resources")
//   const [currentNavSectionId, setCurrentNavSectionId] = useState<string>("0")

//   const navigationSections = [
//     {
//       name: t("rmi.title"),
//       id: "0",
//     },
//     {
//       name: t("gwpAndPenrt.gwp.title"),
//       id: "1",
//     },
//     {
//       name: t("gwpAndPenrt.penrt.title"),
//       id: "2",
//     },
//   ]

//   return (
//     <div className={className}>
//       <h2 className="text-l max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
//         {t("moduleTitle")}
//       </h2>
//       <h3 className="text-l mb-4 max-w-xl leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
//         {t("moduleSubTitle")}
//       </h3>
//       <div className="flex flex-col md:flex-row">
//         <div className="md:w-1/4">
//           <VerticalNavigation
//             navigation={navigationSections}
//             currentSectionId={currentNavSectionId}
//             onSelect={setCurrentNavSectionId}
//           />
//         </div>
//         <div className="px-16 pt-8 md:w-3/4">
//           {currentNavSectionId === "0" && (
//             <Rmi dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} nrf={nrf} />
//           )}
//           {currentNavSectionId === "1" && (
//             <Gwp dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} nrf={nrf} />
//           )}
//           {currentNavSectionId === "2" && (
//             <Penrt dinEnrichedBuildingComponents={dinEnrichedBuildingComponents} nrf={nrf} />
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Resources
