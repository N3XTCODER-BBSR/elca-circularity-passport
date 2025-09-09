/**
 * This file is part of the "eLCA Circularity Index and Building Resource Passport" project.
 *
 * Circularity Index
 * A web-based add-on to eLCA, to calculate the circularity index of a building according to "BNB-Steckbrief 07 Kreislauffähigkeit".
 *
 * Building Resource Passport
 * A website for exploring and downloading normed sustainability indicators of a building.
 *
 * Copyright (c) 2024 N3xtcoder <info@n3xtcoder.org>
 * Nextcoder Softwareentwicklungs GmbH - http://n3xtcoder.org/
 *
 * Primary License:
 * This project is licensed under the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Additional Notice:
 * This file also contains code originally licensed under the MIT License.
 * Please see the LICENSE file in the root of the repository for details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See <http://www.gnu.org/licenses/>.
 */

import { useFormatter } from "next-intl"
import { getFormatter } from "next-intl/server"

/**
 * Formats a circularity metric value with consistent 1 decimal place
 * This function is designed for server-side rendering where useFormatter is not available
 *
 * @param value - The circularity metric value to format
 * @param locale - The locale for formatting (e.g., 'de', 'en', 'es')
 * @returns Formatted string with 1 decimal place, or "-" if value is null/undefined
 */
export const formatCircularityMetricServer = async (
  value: number | null | undefined,
  locale: string
): Promise<string> => {
  if (value == null || Number.isNaN(value)) {
    return "-"
  }

  const formatter = await getFormatter({ locale })
  return formatter.number(value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
} /**
 * React hook that provides a consistent interface for formatting circularity metrics
 * This hook is designed for client-side components and provides the formatter function
 *
 * @returns An object with a formatCircularityMetric function
 */

export const useCircularityFormatter = () => {
  const format = useFormatter()

  return {
    formatCircularityMetric: (value: number | null | undefined): string => {
      if (value == null || Number.isNaN(value)) {
        return "-"
      }

      return format.number(value, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })
    },
  }
}
