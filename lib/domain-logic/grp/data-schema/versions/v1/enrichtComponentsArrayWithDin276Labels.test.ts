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
import { enrichComponentsArrayWithDin276Labels } from "./enrichtComponentsArrayWithDin276Labels"
import { BuildingComponent } from "./passportSchema"

// TODO (L): fix the tests in this file
// Mock Data
const mockBuildingComponents: BuildingComponent[] = [
  {
    costGroupDIN276: 341,
    someOtherField: "value1",
  },
  {
    costGroupDIN276: 372,
    someOtherField: "value2",
  },
  {
    costGroupDIN276: 535,
    someOtherField: "value3",
  },
  {
    costGroupDIN276: 999, // non-existing value
    someOtherField: "value4",
  },
]

describe("enrichComponentsArrayWithDin276Labels", () => {
  it("should enrich components with correct DIN labels", () => {
    const result = enrichComponentsArrayWithDin276Labels(mockBuildingComponents)

    // Test the first component
    expect(result[0].dinGroupLevelNumber).toBe(300)
    expect(result[0].din276GroupName).toBe("Bauwerk - Baukonstruktionen")
    expect(result[0].dinCategoryLevelNumber).toBe(340)
    expect(result[0].din276CategoryName).toBe("Innenwände")
    expect(result[0].dinComponentLevelNumber).toBe(341)
    expect(result[0].din276ComponetTypeName).toBe("Tragende Innenwände")

    // Test the second component
    expect(result[1].dinGroupLevelNumber).toBe(300)
    expect(result[1].din276GroupName).toBe("Bauwerk - Baukonstruktionen")
    expect(result[1].dinCategoryLevelNumber).toBe(370)
    expect(result[1].din276CategoryName).toBe("Baukonstruktive Einbauten")
    expect(result[1].dinComponentLevelNumber).toBe(372)
    expect(result[1].din276ComponetTypeName).toBe("Besondere Einbauten")

    // Test the third component
    expect(result[2].dinGroupLevelNumber).toBe(500)
    expect(result[2].din276GroupName).toBe("Außenanlagen")
    expect(result[2].dinCategoryLevelNumber).toBe(530)
    expect(result[2].din276CategoryName).toBe("Baukonstruktionen in Außenanlagen")
    expect(result[2].dinComponentLevelNumber).toBe(535)
    expect(result[2].din276ComponetTypeName).toBe("Überdachungen")

    // Test the fourth component (No group found)
    // TODO: Error handling?
    expect(result[3].dinGroupLevelNumber).toBe(900)
    expect(result[3].din276GroupName).toBe("DIN 900") // Default since no category exists
    expect(result[3].dinCategoryLevelNumber).toBe(990)
    expect(result[3].din276CategoryName).toBe("DIN 990") // Default since no category exists
    expect(result[3].dinComponentLevelNumber).toBe(999)
    expect(result[3].din276ComponetTypeName).toBe("DIN 999") // Default since no component exists
  })
})
