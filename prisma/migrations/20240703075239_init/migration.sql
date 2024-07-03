-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "buildingStructureId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);
