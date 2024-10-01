enum EolClasses {
  NA = "N/A",
  A = "A",
  B = "B",
  C = "C",
  CD = "C/D",
  D = "D",
  DE = "D/E",
  E = "E",
  EF = "E/F",
  F = "F",
  FG = "F/G",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
}

function getEolClassNameByPoints(points?: number): EolClasses {
  if (points == null || Number.isNaN(points)) return EolClasses.NA
  if (points >= 140) return EolClasses.A
  if (points >= 100) return EolClasses.B
  if (points >= 80) return EolClasses.C
  if (points >= 70) return EolClasses.CD
  if (points >= 60) return EolClasses.D
  if (points >= 40) return EolClasses.DE
  if (points >= 20) return EolClasses.E
  if (points >= 0) return EolClasses.EF
  if (points >= -20) return EolClasses.F
  if (points >= -40) return EolClasses.FG
  if (points >= -60) return EolClasses.G
  if (points >= -80) return EolClasses.H
  if (points >= -100) return EolClasses.I
  if (points >= -140) return EolClasses.J
  return EolClasses.J
}

export { EolClasses }
export default getEolClassNameByPoints
