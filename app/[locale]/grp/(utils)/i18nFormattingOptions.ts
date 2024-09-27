import { Formats } from "next-intl"

export default {
  number: {
    integer: {
      style: "decimal",
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
    percentage: {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
} as Partial<Formats>
