"use client"

import QRCode from "qrcode.react"
import { DinEnrichedPassportData } from "app/[locale]/(utils)/data-schema/versions/v1/enrichtComponentsArrayWithDin276Labels"
import { env } from "../../../../env.mjs"

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
        <FooterItem title="Version" value={passportData.versionTag} />
        <FooterItem title="UUID" value={passportData.uuid} />
        <div className="">
          <QRCode value={qrCodeValue} size={40} />
        </div>
      </div>
    </div>
  )
}
export default Footer
