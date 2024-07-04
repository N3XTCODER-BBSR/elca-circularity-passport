import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const passport1 = await prisma.passport.upsert({
    where: { id: '1' },
    update: {},
    create: {
      name: 'Passport Demo 1',
        id: '1',
        buildingStructureId: '92JUR-XR09-2022',
        authorName: 'Carlos Sampleperson',
        address: 'Birkenallee 12, 12345 Berlin',
        issueDate: new Date('2024-04-02'),
        expiryDate: new Date('2029-04-02'),

    },
  })
  console.log({ alice: passport1 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })