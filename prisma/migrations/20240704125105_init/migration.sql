-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "buildingStructureId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "buildingYear" INTEGER NOT NULL,
    "buildingType" TEXT NOT NULL,
    "numberOfFloors" INTEGER NOT NULL,
    "nrf" TEXT NOT NULL,
    "bgf" TEXT NOT NULL,
    "bri" TEXT NOT NULL,
    "plotArea" TEXT NOT NULL,
    "percentageOfSealedLandArea" INTEGER NOT NULL,
    "totalMassOfBuilding" INTEGER NOT NULL,
    "dataQuality" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);
