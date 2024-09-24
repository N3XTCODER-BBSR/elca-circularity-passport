import "styles/global.css"
import NavBar from "./(components)/NavBar"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1200px] px-12 lg:px-20" style={{ margin: "0 auto" }}>
      <NavBar />
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8">{children}</div>
      </section>
    </div>
  )
}
