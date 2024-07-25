import Navbar from "components/NavBar/NavBar"
import prisma from "prisma/prismaClient"
import passportParser from "utils/zod/passportParser"
import { PassportData } from "utils/zod/passportSchema"
import Overview from "./(components)/tabs/overview"

export default async function Page({ params }: { params: { uuid: string } }) {
  const passport = await prisma.passport.findFirst({
    where: {
      uuid: params.uuid,
    },
  })

  if (passport == null) {
    console.error("Passport not found")
    // TODO: show next.js error page
    return null
  }

  const passportData: PassportData = passportParser(passport.passportData)

  // const [currentTabIdx, setCurrentTabIdx] = useState(0)
  const currentTabIdx = 0
  // TODO: refactor this: either use partial rendering (mixing server and client rendering)
  // or use a different approach to handle the tabs (e.g. using different pages for each tab)

  const tabs = [
    { name: "Überblick", href: "#overview" },
    { name: "Katalog", href: "#catalog" },
    { name: "Vergleich", href: "#comparison" },
  ]

  return (
    <>
      <div className="px-12 lg:px-20">
        <Navbar
          tabs={tabs}
          currentTabIdx={currentTabIdx}
          // setCurrentTabIdx={setCurrentTabIdx}
          // setCurrentTabIdx={() => {}}
        />
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8">
            {tabs[currentTabIdx]?.href === "#overview" && <Overview passportData={passportData} />}
          </div>
        </section>
      </div>
    </>
  )
}
