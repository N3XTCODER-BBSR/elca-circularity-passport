import Decimal from "decimal.js"
import { ElcaProjectComponentRow } from "lib/domain-logic/types/domain-types"
import { getDataForMassCalculationByProductId } from "prisma/queries/legacyDb"

export const calculateVolumeForLayer = (component: ElcaProjectComponentRow): number | null =>
  component.layer_length != null && component.layer_width != null && component.layer_size != null
    ? component.layer_length * component.layer_width * component.layer_size
    : null

export const getWeightByProductId = async (productId: number) => {
  const productData = await getDataForMassCalculationByProductId(productId)

  if (!productData) {
    throw new Error("Product not found")
  }

  // Extract necessary fields
  const quantity = new Decimal(productData.quantity)
  const layerSize = productData.layer_size ? new Decimal(productData.layer_size) : null
  const layerAreaRatio = productData.layer_area_ratio ? new Decimal(productData.layer_area_ratio) : new Decimal(1)
  const processConfig = productData.process_configs
  const processConversion = productData.process_conversions

  if (!processConfig) {
    throw new Error("Process config not found for the product")
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
    throw new Error("Density not specified in the process config, attributes, or conversion factor")
  }

  let adjustedQuantity = quantity

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
  if (productData.is_layer) {
    if (!layerSize) {
      throw new Error("Layer size is required for layer components")
    }
    // For layers, calculate volume considering the area ratio
    volume = adjustedQuantity.mul(layerAreaRatio).mul(layerSize)
  }

  // Now, calculate the amount in kg
  const amount = volume.mul(density)
  // TODFO: consider to return both mass/weight AND volume to have single source of truth for both calculations
  // Also check potential naming inconsistencies regarding mass/weight
  return amount.toNumber()
}
