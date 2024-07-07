import Navbar from "components/NavBar/NavBar"
import Overview from "./(components)/tabs/overview";

export default function Page({ params }: { params: { passportId: string } }) {

    // const [currentTabIdx, setCurrentTabIdx] = useState(0)
    const currentTabIdx = 0;
    // TODO: refactor this: either use partial rendering (mixing server and client rendering)
    // or use a different approach to handle the tabs (e.g. using different pages for each tab)

    const tabs = [
        { name: 'Überblick', href: '#overview' },
        { name: 'Katalog', href: '#catalog' },
        { name: 'Vergleich', href: '#comparison' }
    ]

    return <>
    <div className="px-12 lg:px-20">
        <Navbar
            tabs={tabs}
            currentTabIdx={currentTabIdx}
            // setCurrentTabIdx={setCurrentTabIdx}
            // setCurrentTabIdx={() => {}}
        />
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8">
                {tabs[currentTabIdx]?.href === '#overview' && <Overview passportUuid={params.passportId} />}
            </div>
        </section>
        </div>
    </>
}
