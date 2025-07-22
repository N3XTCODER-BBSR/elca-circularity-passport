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

import { useEffect, useState } from "react"
import { debounce } from "lodash"

/**
 * A custom hook that debounces a value by delaying its update.
 * Uses Lodash's debounce function for better performance and reliability.
 * Useful for reducing the frequency of updates, especially with input fields or API calls.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds before updating the value
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * const [text, setText] = useState("")
 * const debouncedText = useDebounce(text, 500)
 *
 * // debouncedText will update 500ms after the last change to text
 * useEffect(() => {
 *   // Handle debounced value change
 * }, [debouncedText])
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Create a debounced function that updates the state
    const updateValue = debounce((newValue: T) => {
      setDebouncedValue(newValue)
    }, delay)

    // Call the debounced function with the current value
    updateValue(value)

    // Cleanup: cancel any pending debounced calls when value or delay changes
    return () => {
      updateValue.cancel()
    }
  }, [value, delay])

  return debouncedValue
}
