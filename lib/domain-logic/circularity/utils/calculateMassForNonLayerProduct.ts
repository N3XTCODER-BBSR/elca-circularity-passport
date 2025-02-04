import Decimal from "decimal.js"
import { legacyDbDalInstance } from "prisma/queries/dalSingletons"

export class UnsupportedUnitError extends Error {
  constructor(unit: string) {
    super(`Unsupported unit: "${unit}". Only m, m2, m3, or kg are allowed.`)
  }
}

/**
 * Calculates the mass (in kg) for a non-layer element component.
 *
 * If the direct conversion record (from the element component’s process_conversion)
 * is not converting to kg (e.g. it is an identity conversion), then this function
 * falls back to looking up the true density from the audit records.
 *
 * It throws an error if the input or output unit is not one of:
 * "m", "m2", "m3", or "kg".
 */
export const calculateMassForNonLayerProduct = async (elementComponentId: number): Promise<number> => {
  // Load the element component and include its process conversion and process config.
  const elementComponent = await legacyDbDalInstance.getElementComponentWithDetails(elementComponentId)

  if (!elementComponent) {
    throw new Error("Element component not found.")
  }
  if (elementComponent.is_layer) {
    throw new Error("This function is only for non-layer components.")
  }

  const { quantity, process_config_id } = elementComponent
  const compQuantity = new Decimal(quantity || 0)

  // Get the direct conversion record.
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

  // Define allowed units.
  const allowedUnits = ["m", "m2", "m3", "kg"]

  // Validate that both the in_unit and out_unit are allowed.
  if (!allowedUnits.includes(directInUnit)) {
    throw new UnsupportedUnitError(directInUnit)
  }
  if (!allowedUnits.includes(directOutUnit)) {
    throw new UnsupportedUnitError(directOutUnit)
  }

  // Determine the effective conversion factor.
  // If the direct conversion record converts directly to kg (e.g. m3 -> kg or m2 -> kg)
  // with a factor greater than 1, use it. Otherwise, fallback.
  let effectiveFactor = directFactor
  if (
    // Either the conversion isn't going to kg…
    directOutUnit !== "kg" ||
    // …or it is, but the factor is 1 (identity conversion)
    directFactor.eq(1)
  ) {
    // Use a fallback: Look up the density factor from the audit table.
    // Pass along the in_unit from the direct conversion and request output in kg.
    effectiveFactor = await findDensityFactor(process_config_id, directInUnit, "kg")
  }

  // Final mass is quantity multiplied by the effective factor.
  const mass = compQuantity.mul(effectiveFactor)
  return mass.toNumber()
}

/**
 * Looks up the density factor for a given process config.
 *
 * It queries the process conversion audit table for records matching the given process_config_id,
 * the specified input unit, and an output unit of kg.
 *
 * If a record with a factor greater than 1 is found, that factor is returned.
 * (For example, for process_config_id 49 with in_unit 'm3', out_unit 'kg', factor 2000 is returned;
 *  for another process config with in_unit 'm2', out_unit 'kg', factor 35.8 might be expected.)
 *
 * If no record is found, 1 is returned.
 */
const findDensityFactor = async (processConfigId: number, inUnit: string, outUnit: string): Promise<Decimal> => {
  // Query the audit table for matching records.
  const auditRecords = await legacyDbDalInstance.getProcessConversionAuditRecords(processConfigId, inUnit, outUnit)

  for (const record of auditRecords) {
    if (record.factor && new Decimal(record.factor).gt(1)) {
      return new Decimal(record.factor)
    }
    if (record.old_factor && new Decimal(record.old_factor).gt(1)) {
      return new Decimal(record.old_factor)
    }
  }

  return new Decimal(1)
}
