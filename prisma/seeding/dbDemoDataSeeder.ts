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
import generatePassport from "../../lib/domain-logic/grp/data-schema/versions/v1/passportJsonSeeder"
import { prisma } from "../prismaClient" // needs to be relative path

const seedPassport = async () => {
  const passport1PassDataV1 = generatePassport(20, 7)

  await prisma.passport.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      uuid: passport1PassDataV1.uuid,
      projectVariantId: "1",
      versionTag: "1",
      passportData: JSON.stringify(passport1PassDataV1),
      issueDate: new Date("2024-04-02"),
      expiryDate: new Date("2029-04-02"),
    },
  })
}

async function main() {
  if (process.env.SEED_DEMO_DATA !== "true") {
    console.log('env variable "SEED_DEMO_DATA" not set to "true" - will abort demo seeding...')
    return
  }

  try {
    await seedPassport()
    console.log("Demo data seeding completed successfully.")
  } catch (error) {
    console.error("Error during demo data seeding:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
