/**
 * Formats a number with German locale and specified decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (both minimum and maximum)
 */
export const formatNumber = (value: number, decimals: number = 1) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

/**
 * Maps Arabic numerals to Roman numerals
 */
export const romanNumeralMap: Record<string, string> = {
  "1": "I",
  "2": "II",
  "3": "III",
  "4": "IV",
}

/**
 * Converts a number or string to Roman numeral if possible
 * @param value - The value to convert
 */
export const formatRoman = (value: string) => romanNumeralMap[value] || value
