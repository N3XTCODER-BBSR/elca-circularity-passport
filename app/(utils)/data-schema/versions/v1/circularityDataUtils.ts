function getEolClassNameByPoints(points?: number) {
  if (points == null) return "N/A"
  if (points >= 140) return "A"
  if (points >= 100) return "B"
  if (points >= 80) return "C"
  if (points >= 70) return "C/D"
  if (points >= 60) return "D"
  if (points >= 40) return "D/E"
  if (points >= 20) return "E"
  if (points >= 0) return "E/F"
  if (points >= -20) return "F"
  if (points >= -40) return "F/G"
  if (points >= -60) return "G"
  if (points >= -80) return "H"
  if (points >= -100) return "I"
  if (points >= -140) return "J"
  return "J"
}

export default getEolClassNameByPoints
