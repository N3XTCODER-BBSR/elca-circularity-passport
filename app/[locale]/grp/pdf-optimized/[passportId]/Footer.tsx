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
"use client"

import QRCode from "qrcode.react"
import { DinEnrichedPassportData } from "lib/domain-logic/grp/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { env } from "../../../../../env.mjs"

const FooterItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="border-l-[0.5mm] border-black pl-4">
      <p className="text-[9pt] uppercase text-gray-500">{title}</p>
      <p className="text-[7pt]">{value}</p>
    </div>
  )
}

const Footer = ({ passportData }: { passportData: DinEnrichedPassportData }) => {
  const qrCodeValue = JSON.stringify(`${env.NEXT_PUBLIC_PASSPORT_BASE_URL}/${passportData.uuid}`)
  return (
    <div className="footer flex items-center justify-between bg-gray-50 p-4">
      <div className="flex space-x-8">
        <FooterItem title="Date" value={passportData.date} />
        <FooterItem title="Author" value={passportData.authorName} />
        <FooterItem title="UUID" value={passportData.uuid} />
        <div className="">
          <QRCode value={qrCodeValue} size={40} />
        </div>
      </div>
    </div>
  )
}
export default Footer
