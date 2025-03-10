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
// Module
export const ModuleContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[7pt]">{children}</div>
)
export const ModuleTitle = ({ title }: { title: string }) => (
  <h2 className="mb-[2.7mm] mt-[1.5mm] text-[8.64pt] font-semibold uppercase">{title}</h2>
)
export const ModuleMain = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row gap-[4mm]">{children}</div>
)

// Module Section
export const ModuleSectionContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="min-w-0 flex-1">{children}</div>
)
export const ModuleSectionTitle = ({ title }: { title: string }) => {
  return <h2 className="mb-[2.71mm] bg-gray-200 px-[3mm] py-[1mm] text-[7.68pt] font-semibold">{title}</h2>
}
export const ModuleSectionMain = ({ children, height = 50 }: { children: React.ReactNode; height?: number }) => (
  <div className="flex-1">
    <div
      className={`flex gap-[1mm]`}
      style={{
        height: `${height}mm`,
      }}
    >
      {children}
    </div>
  </div>
)

export const Box = ({ children, height, isCol }: { children: React.ReactNode; height?: number; isCol?: boolean }) => (
  <div
    className={`flex flex-1 ${isCol ? "flex-col" : ""}`}
    style={{
      height: height ? `${height}mm` : "auto", // Apply height if passed, otherwise default to 'auto'
    }}
  >
    {children}
  </div>
)

// TEXT

export const TextXSLeading4 = ({
  children,
  light = false,
  semiBold = false,
}: {
  children: React.ReactNode
  light?: boolean
  semiBold?: boolean
}) => (
  <span className={`text-[5.76pt] ${light ? "text-gray-500" : "text-blue-gray-800"} ${semiBold && "font-semibold"}`}>
    {children}
  </span>
)
