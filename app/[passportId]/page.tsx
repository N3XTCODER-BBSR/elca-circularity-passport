'use client';

import { useState } from "react";
import Navbar from "components/NavBar/NavBar"

export default function Page({ params }: { params: { passportId: string } }) {

    const [currentTabIdx, setCurrentTabIdx] = useState(0)

    const tabs = [
        { name: 'Überblick', href: 'overview', content: <>Überblick</> },
        { name: 'Katalog', href: 'catalog', content: <>Katalog</> },
        { name: 'Vergleich', href: 'comparison', content: <>Vergleich</> }
    ]

    return <>
        <Navbar
            tabs={tabs}
            currentTabIdx={currentTabIdx}
            setCurrentTabIdx={setCurrentTabIdx}
        />
        <section className="bg-white dark:bg-gray-900">
            <div className="mx-auto p-8 lg:p-16">
                {tabs[currentTabIdx]?.content}
            </div>
        </section>
    </>
}
