import Link from "next/link"
import { twMerge } from "tailwind-merge"
import { usePathname } from "i18n/routing"

type NavigationLinksProps = {
  navigation: { id: string; name: string; href: string }[]
}

const NavigationLinks = ({ navigation }: NavigationLinksProps) => {
  const pathName = usePathname()

  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
      <div className="hidden sm:flex sm:space-x-8">
        {navigation.map((item) => {
          const isActive = pathName === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                isActive
                  ? "border-bbsr-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default NavigationLinks
