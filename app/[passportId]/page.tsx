'use client';
import { useState } from "react";
import Navbar from "components/NavBar/NavBar"

export default function Page({ params }: { params: { passportId: string } }) {

    const tabs = [
        { name: 'Überblick', href: '#' },
        { name: 'Katalog', href: '#' },
        { name: 'Vergleich', href: '#' }
    ]

    const [currentTab, setCurrentTab] = useState(tabs[0]!.name)

    return <>
        <Navbar
            tabs={tabs}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
        />
        {/* Render content based on currentTab */}
        {currentTab === 'Dashboard' && <div>Dashboard content</div>}
        {currentTab === 'Team' && <div>Team content</div>}
        {currentTab === 'Projects' && <div>Projects content</div>}
        {currentTab === 'Calendar' && <div>Calendar content</div>}

        <section className="bg-white dark:bg-gray-900">
            <div className="mx-auto p-8 lg:p-16">

                <h2 className="mb-4 max-w-xl text-l font-extrabold leading-none tracking-tight dark:text-white md:text-2xl xl:text-xl">Gebäuderessourcenpass</h2>
                <p>Bundesministerium für ökologische Innovation, Biodiversitätsschutz und nachhaltigen Konsum – Dienstsitz Berlin</p>
                <span>Passport &quot;{params.passportId}&quot;</span>
            </div>
        </section>
    </>
}
