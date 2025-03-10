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
/**
 * Create a map from a list of items
 * @param list
 * @param keyGetter
 * @returns map
 */
export const createMap = <T, K>(list: T[], keyGetter: (item: T) => K): Map<K, T> => {
  const map = new Map<K, T>()
  list.forEach((item) => {
    map.set(keyGetter(item), item)
  })
  return map
}

/**
 * merges several maps into one that have same key and value types
 * @param maps maps to merge
 * @returns map with entries from all maps
 */
export const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  return new Map<K, V>(maps.map((map) => Array.from(map.entries())).flat())
}
