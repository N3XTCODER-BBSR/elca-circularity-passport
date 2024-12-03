import Decimal from "decimal.js"
import { getDataForMassCalculationByProductId } from "prisma/queries/legacyDb"

export const getWeightByProductId = async (productId: number) => {
  const productData = await getDataForMassCalculationByProductId(productId)

  if (!productData) {
    throw new Error("Product not found")
  }

  // Extract necessary fields
  const quantity = new Decimal(productData.quantity)
  const layerSize = productData.layer_size ? new Decimal(productData.layer_size) : null
  const processConfig = productData.process_configs
  const processConversion = productData.process_conversions

  if (!processConfig) {
    throw new Error("Process config not found for the product")
  }

  // Get the density from the process configuration
  const density = processConfig.density ? new Decimal(processConfig.density) : null

  if (!density) {
    throw new Error("Density not specified in the process config")
  }

  let adjustedQuantity = quantity

  // Adjust the quantity if there is a process conversion
  if (processConversion) {
    // Get the most recent conversion version
    const conversionVersion = processConversion.process_conversion_versions[0]
    if (conversionVersion && conversionVersion.factor) {
      const factor = new Decimal(conversionVersion.factor)
      adjustedQuantity = adjustedQuantity.mul(factor)
    }
  }

  // Calculate volume if layer size is provided
  let volume = adjustedQuantity
  if (layerSize) {
    volume = adjustedQuantity.mul(layerSize)
  }

  // Calculate the amount in kg
  const amount = volume.mul(density)

  return amount.toNumber()
}
