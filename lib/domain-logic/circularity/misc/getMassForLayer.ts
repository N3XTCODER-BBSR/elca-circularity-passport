import Decimal from "decimal.js"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"
import { MassInKg, ProductId } from "./types"

export const getMassForLayers = async (productIds: number[]) => {
  const productData = await legacyDbDalInstance.getDataForMassCalculationByProductId(productIds)

  const productMassMap = new Map<ProductId, MassInKg | null>()

  for (const product of productData) {
    // Extract necessary fields
    const quantity = new Decimal(product.quantity)
    const layerSize = product.layer_size ? new Decimal(product.layer_size) : null
    const layerAreaRatio = product.layer_area_ratio ? new Decimal(product.layer_area_ratio) : new Decimal(1)
    const processConfig = product.process_configs
    const processConversion = product.process_conversions

    if (!processConfig) {
      productMassMap.set(product.id, null)

      continue
    }

    // Initialize density as null
    let density: Decimal | null = null

    // Try to get the density from process_configs.density
    if (processConfig.density) {
      density = new Decimal(processConfig.density)
    }

    // If density is still null, try to get it from process_config_attributes
    if (!density && processConfig.process_config_attributes) {
      const densityAttribute = processConfig.process_config_attributes.find((attr) => attr.ident === "density")
      if (densityAttribute && densityAttribute.numeric_value) {
        density = new Decimal(densityAttribute.numeric_value)
      }
    }

    // If density is still null, try to get it from the conversion factor
    if (!density && processConversion) {
      // Get the most recent conversion version
      const conversionVersion = processConversion.process_conversion_versions[0]
      if (conversionVersion && conversionVersion.factor) {
        const factor = new Decimal(conversionVersion.factor)
        // If converting from m3 to kg, the factor represents density
        if (processConversion.in_unit === "m3" && processConversion.out_unit === "kg") {
          density = factor
        }
      }
    }

    if (!density) {
      productMassMap.set(product.id, null)

      continue
    }

    let adjustedQuantity: Decimal = quantity

    // Adjust the quantity if there is a process conversion (other than density)
    if (processConversion) {
      // Get the most recent conversion version
      const conversionVersion = processConversion.process_conversion_versions[0]
      if (
        conversionVersion &&
        conversionVersion.factor &&
        !(processConversion.in_unit === "m3" && processConversion.out_unit === "kg")
      ) {
        const factor = new Decimal(conversionVersion.factor)
        adjustedQuantity = adjustedQuantity.mul(factor)
      }
    }

    // Calculate volume if layer size is provided
    let volume = adjustedQuantity
    if (product.is_layer) {
      if (!layerSize) {
        productMassMap.set(product.id, null)

        continue
      }
      // For layers, calculate volume considering the area ratio
      volume = adjustedQuantity.mul(layerAreaRatio).mul(layerSize)
    }

    // Now, calculate the amount in kg
    const mass = volume.mul(density).toNumber()

    productMassMap.set(product.id, mass)
  }

  return productMassMap
}
