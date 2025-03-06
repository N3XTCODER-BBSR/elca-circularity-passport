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
// import { useTranslations } from "next-intl"
// import SideBySideDescriptionListsWithHeadline from "app/(components)/generic/SideBySideDescriptionListsWithHeadline"
// import SingleValueDisplay from "app/(components)/generic/SingleValueDisplay"
// import { Ressources } from "lib/domain-logic/grp/data-schema/versions/v1/passportSchema"
// import {
//   calculateGwpABC,
//   calculateQpABC,
//   calculateRmiTotal,
// } from "lib/domain-logic/grp/modules/passport-overview/resources/resources-data-aggregation"

// const ResourceInfo = ({ resources }: { resources: Ressources }) => {
//   const rmiTotal = calculateRmiTotal(resources)
//   const qpABC = calculateQpABC(resources)
//   const gwpABC = calculateGwpABC(resources)
//   const t = useTranslations("Grp.Web.sections.detailPage.componentLayer.resources")

//   const resourceInfoKeyValues = [
//     { key: `RMI ${t("total")} [kg]`, value: rmiTotal },
//     { key: `RMI ${t("Mineral")} [kg]`, value: resources?.rawMaterialsInKg.Mineral.toFixed(2) },
//     { key: `RMI ${t("Metallic")} [kg]`, value: resources?.rawMaterialsInKg.Metallic.toFixed(2) },
//     { key: `RMI ${t("Fossil")} [kg]`, values: resources?.rawMaterialsInKg.Fossil.toFixed(2) },
//     { key: `RMI ${t("Forestry")} [kg]`, value: resources?.rawMaterialsInKg.Forestry.toFixed(2) },
//     { key: `RMI ${t("Agrar")} [kg]`, value: resources?.rawMaterialsInKg.Agrar.toFixed(2) },
//     { key: `RMI ${t("Aqua")} [kg]`, value: resources?.rawMaterialsInKg.Aqua.toFixed(2) },
//   ]

//   return (
//     <div>
//       <SideBySideDescriptionListsWithHeadline headline={t("rawMaterials")} data={resourceInfoKeyValues} />
//       <SingleValueDisplay headline={t("primaryEnergy")} label="kWh" value={Math.floor(qpABC || 0)} />
//       <SingleValueDisplay headline={t("globalWarmingPotential")} label="kg co2eq" value={Math.floor(gwpABC || 0)} />
//       <SingleValueDisplay
//         headline={t("recyclingContent")}
//         label="kg"
//         value={Math.floor(resources?.recyclingContentInKg || 0)}
//       />
//     </div>
//   )
// }

// export default ResourceInfo
