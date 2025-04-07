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
import { createMap } from "app/(utils)/map"
import { dbDalInstance, legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaProjectComponentRow } from "./domain-types"
import { getMassForProducts } from "./getMassForProducts"

export async function preloadCircularityData(components: ElcaProjectComponentRow[], projectId: number) {
  const allComponentIds: Set<number> = new Set(components.map((c) => c.component_id))
  const allOekobaudatProcessUuids: Set<string> = new Set(
    components.map((c) => c.oekobaudat_process_uuid).filter((uuid) => uuid != null)
  )

  const processDbUuid = await legacyDbDalInstance.getProcessDbUuidForProject(projectId)

  if (!processDbUuid) {
    throw new Error("No process_db UUID found for project")
  }

  const [excludedProductRows, userEnrichedRows, tBaustoffMappingEntries, productMassMap] = await Promise.all([
    dbDalInstance.getExcludedProductIds([...Array.from(allComponentIds)]),
    dbDalInstance.getUserDefinedTBaustoffData([...Array.from(allComponentIds)]),
    dbDalInstance.getTBaustoffMappingEntries([...Array.from(allOekobaudatProcessUuids)], processDbUuid),
    getMassForProducts([...Array.from(allComponentIds)]),
  ])

  const excludedProductIdsSet = new Set(excludedProductRows.map((r) => r.productId))
  const userEnrichedMap = createMap(userEnrichedRows, (r) => r.elcaElementComponentId)
  const tBaustoffMappingEntriesMap = createMap(tBaustoffMappingEntries, (r) => r.oebd_processUuid)

  const allTBaustoffProductIds = new Set<number>()
  userEnrichedRows.forEach((row) => {
    if (row.tBaustoffProductDefinitionId !== null) {
      allTBaustoffProductIds.add(row.tBaustoffProductDefinitionId)
    }
  })
  tBaustoffMappingEntries.forEach((entry) => {
    if (entry.tBs_productId !== null) {
      allTBaustoffProductIds.add(entry.tBs_productId)
    }
  })

  const tBaustoffProducts = await dbDalInstance.getTBaustoffProducts([...Array.from(allTBaustoffProductIds)])
  const tBaustoffProductMap = createMap(tBaustoffProducts, (p) => p.id)

  return {
    excludedProductIdsSet,
    userEnrichedMap,
    tBaustoffMappingEntriesMap,
    tBaustoffProductMap,
    productMassMap,
  }
}
