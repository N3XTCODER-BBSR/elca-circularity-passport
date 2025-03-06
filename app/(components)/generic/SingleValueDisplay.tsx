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
const SingleValueDisplay = ({ headline, label, value }: { headline: string; label: string; value: number }) => (
  <div className="my-12">
    <h3 className="mb-4 text-lg font-semibold leading-6 text-gray-900">{headline}</h3>
    <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
      <dt className="text-sm font-bold leading-6 text-gray-900">{label}</dt>
      <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">{value}</dd>
    </div>
  </div>
)

export default SingleValueDisplay
