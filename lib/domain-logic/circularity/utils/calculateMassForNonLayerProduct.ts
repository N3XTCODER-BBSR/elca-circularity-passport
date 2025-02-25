import Decimal from "decimal.js"
import { mergeMaps } from "app/(utils)/map"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { MassInKg, ProductId } from "../misc/types"

const allowedUnits = ["m", "m2", "m3", "kg"]

type DataForMassCalculationWithFallback = {
  productId: number
  processConfigId: number
  directInUnit: string
  quantity: Decimal
}[]

export const getMassForNonLayerProducts = async (elementComponentIds: number[]) => {
  // Load the element component and include its process conversion and process config.
  const elementComponents = await legacyDbDalInstance.getElementComponentsWithDetails(elementComponentIds)

  const productIdMassMap = new Map<ProductId, MassInKg | null>()

  const dataForMassCalculationWithFallback: DataForMassCalculationWithFallback = []

  // loop over all element components, add mass to the map if possible, otherwise add to the fallback data
  for (const elementComponent of elementComponents) {
    const { quantity, process_config_id: processConfigId } = elementComponent

    let directFactor = new Decimal(1)
    let directInUnit = ""
    let directOutUnit = ""
    if (elementComponent.process_conversions) {
      directInUnit = elementComponent.process_conversions.in_unit?.toLowerCase() || ""
      directOutUnit = elementComponent.process_conversions.out_unit?.toLowerCase() || ""
      const version = elementComponent.process_conversions.process_conversion_versions[0]
      if (version?.factor) {
        directFactor = new Decimal(version.factor)
      }
    }

    if (!allowedUnits.includes(directInUnit) || !allowedUnits.includes(directOutUnit)) {
      productIdMassMap.set(elementComponent.id, null)

      continue
    }

    const useFallback = directOutUnit !== "kg" || directFactor.eq(1)

    if (!useFallback) {
      const mass = calculateMassByDensity(quantity, directFactor)
      productIdMassMap.set(elementComponent.id, mass)

      continue
    }

    dataForMassCalculationWithFallback.push({
      productId: elementComponent.id,
      processConfigId,
      directInUnit,
      quantity,
    })
  }

  const fallbackMassMap = await getMassWithFallbackFactor(dataForMassCalculationWithFallback)

  return mergeMaps(productIdMassMap, fallbackMassMap)
}

const getMassWithFallbackFactor = async (data: DataForMassCalculationWithFallback) => {
  const productIdMassMap = new Map<ProductId, MassInKg | null>()

  const fallbackCriteria = data.map(({ processConfigId, directInUnit }) => {
    return {
      process_config_id: processConfigId,
      in_unit: directInUnit,
      out_unit: "kg",
    }
  })

  const auditRecords = await legacyDbDalInstance.getProcessConversionAuditRecords(fallbackCriteria)

  data.map(({ productId, processConfigId, directInUnit, quantity }) => {
    const matchingRecords = auditRecords.filter(
      (record) => record.process_config_id === processConfigId && record.in_unit?.toLowerCase() === directInUnit
    )
    let factor = new Decimal(1)
    for (const record of matchingRecords) {
      if (record.factor && (new Decimal(record.factor).gt(1) || directInUnit === "m")) {
        factor = new Decimal(record.factor)
        break
      }
      if (record.old_factor && (new Decimal(record.old_factor).gt(1) || directInUnit === "m")) {
        factor = new Decimal(record.old_factor)
        break
      }
    }

    const mass = calculateMassByDensity(quantity, factor)
    productIdMassMap.set(productId, mass)
  })

  return productIdMassMap
}

const calculateMassByDensity = (quantity: Decimal, density: Decimal) => {
  return quantity.mul(density).toNumber()
}
