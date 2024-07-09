import { InformationCircleIcon } from "@heroicons/react/20/solid"
import prisma from "prisma/prismaClient"
import { Passport, PassportSchema } from "utils/zod/passportSchema"

const Overview = async ({ passportUuid }: { passportUuid: string }) => {
  const passport = await prisma.passport.findUnique({
    where: {
      id: passportUuid,
    },
  })

  const passportData: Passport = PassportSchema.parse(passport?.passportData)

  return (
    <>
      <h2 className="text-l mb-4 max-w-xl font-extrabold leading-none tracking-tight dark:text-white lg:text-2xl xl:text-xl">
        Gebäuderessourcenpass
      </h2>
      <p>
        Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin
      </p>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-1/2 lg:border-r-2">
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Gebäude/Bauwerk-ID:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.buildingStructureId}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Adresse:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.address}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Baujahr:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.buildingYear}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Gebäudetyp:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.buildingType}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Geschossanzahl des Gebäudes:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.numberOfFloors}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="flex text-sm font-bold leading-6 text-gray-900">
                  <InformationCircleIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  NRF:
                </dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {/* {passportData?.nrf} */}
                </dd>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">BGF:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {/* {passportData?.bgf} */}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">BRI:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {/* {passportData?.bri} */}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Grundstücksfläche:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {passportData.buildingBaseData.plotArea}
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Anteil versiegelte Grundstücksfläche:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {/* {passportData?.percentageOfSealedLandArea} */}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Gesamtmasse des Gebäudes:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                </dd>
              </div>
              <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-3">
                <dt className="text-sm font-bold leading-6 text-gray-900">Datenqualität:</dt>
                <dd className="mt-1 text-right text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0">
                  {/* {passportData?.dataQuality} */}
                </dd>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </>
  )
}

export default Overview
