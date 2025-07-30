/**
 * Calculates the interpolated points for Rückbaubarkeit (dismantling) according to official rules.
 *
 * @param rueckbau - The weighted Rückbaupotenzial (RGeb)
 * @returns The calculated points (0-30, rounded)
 */
export function calculateBnbDismantlingPoints(rueckbau: number): number {
  const Rmax = 50
  const Rmin = 20
  if (rueckbau >= Rmax) return 30
  if (rueckbau <= Rmin) return 0
  // Interpolate and round to nearest integer
  return Math.round(((rueckbau - Rmin) / (Rmax - Rmin)) * 30)
}

/**
 * Calculates the interpolated points for Zirkularität according to official rules.
 *
 * @param zirkularitaet - The weighted Zirkularitätspotenzial (ZGeb)
 * @returns The calculated points (0-60, rounded)
 */
export function calculateBnbCircularityPoints(zirkularitaet: number): number {
  const Zmax = 60
  const Zmin = 20
  if (zirkularitaet >= Zmax) return 60
  if (zirkularitaet <= Zmin) return 0
  // Interpolate and round to nearest integer
  return Math.round(((zirkularitaet - Zmin) / (Zmax - Zmin)) * 60)
}
