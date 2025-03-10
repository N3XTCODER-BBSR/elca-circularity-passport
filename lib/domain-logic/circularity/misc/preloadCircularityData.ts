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
import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { dbDalInstance } from "prisma/queries/dalSingletons"
import { getMassForProducts } from "./getMassForProducts"

export async function preloadCircularityData(components: ElcaProjectComponentRow[]) {
  const allComponentIds = new Set<number>()
  const allOekobaudatProcessUuids = new Set<string>()

  components.forEach((component) => {
    allComponentIds.add(component.component_id)
    if (component.oekobaudat_process_uuid) {
      allOekobaudatProcessUuids.add(component.oekobaudat_process_uuid)
    }
  })

  const [excludedProductRows, userEnrichedRows, tBaustoffMappingEntries, productMassMap] = await Promise.all([
    dbDalInstance.getExcludedProductIds([...Array.from(allComponentIds)]),
    dbDalInstance.getUserDefinedTBaustoffData([...Array.from(allComponentIds)]),
    dbDalInstance.getTBaustoffMappingEntries([...Array.from(allOekobaudatProcessUuids)]),
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
