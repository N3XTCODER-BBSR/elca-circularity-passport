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
import { BuildingComponent, PassportData } from "./versions/v1/passportSchema"

export type Din276Mapping = {
  [key: string]: string
}

export type generateComponents = (componentCount: number, layerCount: number) => BuildingComponent[]

export type generatePassport = (componentCount: number, layerCount: number) => PassportData

export type Seeder = {
  generateComponents: generateComponents
  generatePassport: generatePassport
}

export type Version = {
  Din276Mapping: Din276Mapping
  // schema: TYPEHERE
  versionTag: string
  seeder: Seeder
  migrateFromPreviousVersion<PreviousVersion extends Version>(passportData: PreviousVersion): Version
}

export type versionFactory = () => Version

// export const currentVersion: Version =
