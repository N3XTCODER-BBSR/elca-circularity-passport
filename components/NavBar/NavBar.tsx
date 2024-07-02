import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useState } from 'react'

interface Tab {
    name: string
    href: string
}

interface NavbarProps {
    tabs: Tab[]
    currentTab: string
    setCurrentTab: (tabName: string) => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ tabs, currentTab, setCurrentTab }: NavbarProps) {
    const handleTabClick = (tabName: string) => {
        setCurrentTab(tabName)
    }

    return (
        <Disclosure as="nav" className="bg-white shadow">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    {tabs.map((tab) => (
                                        <a
                                            key={tab.name}
                                            href={tab.href}
                                            className={classNames(
                                                tab.name === currentTab
                                                    ? 'border-indigo-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                            )}
                                            onClick={() => handleTabClick(tab.name)}
                                        >
                                            {tab.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {tabs.map((tab) => (
                                <DisclosureButton
                                    key={tab.name}
                                    as="a"
                                    href={tab.href}
                                    className={classNames(
                                        tab.name === currentTab
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                    )}
                                    onClick={() => handleTabClick(tab.name)}
                                >
                                    {tab.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}
