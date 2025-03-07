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
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { NextRequest, NextResponse } from "next/server"

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: `https://${process.env.S3_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

async function generatePresignedUploadUrl(key: string, contentType = "application/octet-stream"): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  })

  // Generate a URL that expires in 60 seconds
  const url = await getSignedUrl(s3Client, command, { expiresIn: 6000 })
  return url
}

export async function GET(req: NextRequest, { params }: { params: { passportId: string } }) {
  const { passportId } = params

  // For now, we just always print the German version of the passport as PDF
  const locale = "de"
  const hostname = req.headers.get("host")
  const urlOfPrintOptimizedPassport = `https://${hostname}/${locale}/grp/pdf-optimized/${passportId}`

  const passportPdfExportFilename = `${passportId}_${Date.now()}.pdf`
  const presignedUploadUrl = await generatePresignedUploadUrl(passportPdfExportFilename)

  const response = await fetch("https://api.doppio.sh/v1/render/pdf/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DOPPIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      doppio: {
        presignedUrl: presignedUploadUrl,
      },
      page: {
        pdf: {
          printBackground: true,
          preferCSSPageSize: true,
        },
        goto: {
          url: urlOfPrintOptimizedPassport,
          options: {
            waitUntil: ["networkidle2"],
          },
        },
      },
    }),
  })

  const data: any = await response.json()

  if (data.renderStatus === "SUCCESS") {
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${passportPdfExportFilename}`

    return NextResponse.json({ documentUrl: publicUrl })
  } else {
    console.error("Failed to render PDF")
    console.error("data:", data)
    console.error("url", urlOfPrintOptimizedPassport)
    console.error("presignedUploadUrl", presignedUploadUrl)
    console.error("process.env.S3_BUCKET_NAME", process.env.S3_BUCKET_NAME)
    console.error("process.env.S3_REGION", process.env.S3_REGION)
    console.error("process.env.S3_ENDPOINT", process.env.S3_ENDPOINT)
    return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 })
  }
}
