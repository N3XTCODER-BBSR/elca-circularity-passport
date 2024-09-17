import type { CirculartyDataItem } from "domain-logic/grp/modules/passport-overview/circularity/circularity-data-aggregation"

const colors: { [key: string]: string } = {
  A: "#3e5529",
  B: "#eaeee5",
  C: "#b1cf95",
  "C/D": "#b1cf95",
  D: "#E2EFDA",
  "D/E": "#E2EFDA",
  E: "#FFD967",
  "E/F": "#FFD967",
  F: "#E36C0A",
  "F/G": "#E36C0A",
  G: "#8e4d1c",
}
const getColor = (barDatum: { data: CirculartyDataItem }) => {
  return colors[barDatum.data.eolClass] || "black"
}

export default getColor
