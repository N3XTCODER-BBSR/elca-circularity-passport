'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

interface Tab {
    name: string
    href: string
    content: JSX.Element
}

interface NavbarProps {
    tabs: Tab[]
    currentTabIdx: number
    setCurrentTabIdx: (tabIdx: number) => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ tabs, currentTabIdx, setCurrentTabIdx }: NavbarProps) {
    const handleTabClick = (tabIdx: number) => {
        setCurrentTabIdx(tabIdx)
    }

    return (
        <Disclosure as="nav" className="bg-white shadow">
            {() => (
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
                                            key={tab.href}
                                            href={tab.href}
                                            className={classNames(
                                                tab.href === tabs[currentTabIdx]?.href
                                                    ? 'border-indigo-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                                            )}
                                            onClick={() => handleTabClick(tabs.findIndex(t => t.href === tab.href))}
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
                                    key={tab.href}
                                    as="a"
                                    href={tab.href}
                                    className={classNames(
                                        tab.href === tabs[currentTabIdx]?.href ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
                                        'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                                    )}
                                    onClick={() => handleTabClick(tabs.findIndex(t => t.href === tab.href))}                                >
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
