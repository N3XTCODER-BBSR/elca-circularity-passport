/**
 * Utility function to format unit strings for display
 * Converts common unit abbreviations to their proper Unicode representations
 */
export function formatUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    m2: "m²",
    m3: "m³",
  }

  return unitMap[unit] || unit
}
