import Link from "next/link"
import { getTranslations } from "next-intl/server"
import passportParser from "app/[locale]/grp/(utils)/data-schema/versions/v1/passportParser"
import prisma from "prisma/prismaClient"

export default async function Web() {
  const t = await getTranslations("Web")
  const passports = await prisma.passport.findMany()

  const passportsData = passports.map((passport) => passportParser(passport.passportData))
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              {t("title")}
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
              {t("description")}
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6">
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {passportsData.map((passportData) => (
              <div key={passportData.uuid} className="flex flex-col items-center justify-center text-center">
                passportData.uuid: {passportData.uuid}
                <Link href={`/grp/${passportData.uuid}`}>
                  <h3 className="mb-2 text-xl font-bold dark:text-white">{passportData.buildingBaseData.address}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
