/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */
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
