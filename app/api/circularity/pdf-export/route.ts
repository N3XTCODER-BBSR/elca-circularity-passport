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
import { getServerSession } from "next-auth/next"
import authOptions from "app/(utils)/authOptions"
import { generateOneTimePdfToken } from "lib/auth/pdfTokenAuth"

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

  // Generate a URL that expires in 600 seconds
  const url = await getSignedUrl(s3Client, command, { expiresIn: 60000 })
  return url
}

type PdfExportRequestBody = {
  projectId: number
  variantId: number
}

export async function POST(req: NextRequest) {
  const secureNextAuthSessionToken = req.cookies.get("__Secure-next-auth.session-token")?.value || ""
  const nextAuthSessionToken = req.cookies.get("next-auth.session-token")?.value || ""

  // Forward the user's session cookie to Doppio for authentication
  const body = (await req.json()) as PdfExportRequestBody

  if (!body.projectId || !body.variantId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  // For now, we just always print the German version of the catalog as PDF
  const locale = "de"
  const hostname = req.headers.get("host")

  // Generate one-time token for this user/project/variant
  // Extract userId from session using getServerSession
  const session = await getServerSession(authOptions)
  let userId: string | null = null
  userId = String(session?.user?.id)
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const oneTimeToken = await generateOneTimePdfToken({
    userId,
    projectId: body.projectId,
    variantId: body.variantId,
    expiresInSeconds: 180,
  })
  const urlOfPrintOptimizedComponentCatalog = `https://${hostname}/${locale}/pdf-optimized/projects/${body.projectId}/variants/${body.variantId}?oneTimeToken=${oneTimeToken}`
  const catalogPdfExportFilename = `elca_bauteil_katalog_${body.projectId}_${body.variantId}_${Date.now()}.pdf`
  const presignedUploadUrl = await generatePresignedUploadUrl(catalogPdfExportFilename)

  const footerHtml = `
    <div style="width: 100%; font-size: 10px; padding: 0 20px; display: flex; justify-content: space-between; border-top: 1px solid #ccc;">
      <div><span class="date"></span></div>
      <div><span>${catalogPdfExportFilename}</span></div>
      <div><span class="pageNumber"></span>/<span class="totalPages"></span></div>
    </div>
  `
  const headerHtml = `
    <div style="width: 100%; font-size: 10px; padding: 0 20px; display: flex; justify-content: space-between;">
    </div>
  `
  const footerBase64 = Buffer.from(footerHtml).toString("base64")
  const headerBase64 = Buffer.from(headerHtml).toString("base64")
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
          footerTemplate: footerBase64,
          headerTemplate: headerBase64,
          displayHeaderFooter: true,
        },
        goto: {
          url: urlOfPrintOptimizedComponentCatalog,
          options: {
            waitUntil: ["networkidle2"],
          },
        },
      },
    }),
  })

  const data = (await response.json()) as { renderStatus: string }

  if (data.renderStatus === "SUCCESS") {
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${catalogPdfExportFilename}`

    return NextResponse.json({ documentUrl: publicUrl })
  } else {
    console.error("Failed to render PDF")
    console.error("data:", data)
    console.error("url", urlOfPrintOptimizedComponentCatalog)
    console.error("presignedUploadUrl", presignedUploadUrl)
    console.error("process.env.S3_BUCKET_NAME", process.env.S3_BUCKET_NAME)
    console.error("process.env.S3_REGION", process.env.S3_REGION)
    console.error("process.env.S3_ENDPOINT", process.env.S3_ENDPOINT)
    return NextResponse.json({ error: "Failed to render PDF" }, { status: 500 })
  }
}
