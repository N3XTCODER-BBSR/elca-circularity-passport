'use client';

import { useState } from "react";
import Navbar from "components/NavBar/NavBar"
import Overview from "./(components)/tabs/overview";

export default function Page({ params }: { params: { passportId: string } }) {

    const [currentTabIdx, setCurrentTabIdx] = useState(0)

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
            setCurrentTabIdx={setCurrentTabIdx}
        />
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8">
                {tabs[currentTabIdx]?.href === '#overview' && <Overview passportUuid={params.passportId} />}
            </div>
        </section>
        </div>
    </>
}
