import Navbar from "./(components)/NavBar/NavBar"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { passportId: string }
}) {
  return (
    <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
      <Navbar passportId={params.passportId} />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8">{children}</div>
      </section>
    </div>
  )
}
