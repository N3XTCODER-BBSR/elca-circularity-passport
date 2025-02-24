import { dbDalInstance } from "prisma/queries/dalSingletons"
import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { createMap } from "app/(utils)/createMap"

export async function preloadCircularityData(components: ElcaProjectComponentRow[]) {
  const allComponentIds = new Set<number>()
  const allOekobaudatProcessUuids = new Set<string>()

  components.forEach((component) => {
    allComponentIds.add(component.component_id)
    if (component.oekobaudat_process_uuid) {
      allOekobaudatProcessUuids.add(component.oekobaudat_process_uuid)
    }
  })

  const [excludedProductRows, userEnrichedRows, tBaustoffMappingEntries] = await Promise.all([
    dbDalInstance.getExcludedProductIds([...Array.from(allComponentIds)]),
    dbDalInstance.getUserDefinedTBaustoffData([...Array.from(allComponentIds)]),
    dbDalInstance.getTBaustoffMappingEntries([...Array.from(allOekobaudatProcessUuids)]),
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
  }
}
