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
import { Switch } from "@headlessui/react"

const Toggle = ({
  disabled = false,
  isEnabled,
  setEnabled,
  label,
  testId,
}: {
  disabled?: boolean
  isEnabled: boolean
  setEnabled: () => void
  label: string
  testId?: string
}) => {
  const dataTestId = testId ? `toggle__switch__${testId}` : null

  return (
    <Switch
      disabled={disabled}
      checked={isEnabled}
      onChange={setEnabled}
      className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-bbsr-blue-600 focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed bg-gray-100 opacity-30" : "bg-gray-200 data-[checked]:bg-bbsr-blue-600"
      }`}
      data-testid={dataTestId}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
      />
    </Switch>
  )
}

export default Toggle
