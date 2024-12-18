import { twMerge } from "tailwind-merge"
import { Link } from "i18n/routing"
import { usePathname } from "i18n/routing"

type NavigationLinksProps = {
  navigation: { id: string; name: string; href: string }[]
}

const NavigationLinks = ({ navigation }: NavigationLinksProps) => {
  const pathName = usePathname()

  return (
    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
      <ul className="hidden sm:flex sm:space-x-8">
        {navigation.map((item) => {
          const isActive = pathName === item.href

          return (
            <li
              key={item.name}
              className={twMerge(
                isActive
                  ? "border-bbsr-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "border-b-2 px-1 pt-1 text-sm font-medium"
              )}
            >
              <Link
                href={item.href}
                className="inline-flex size-full items-center"
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavigationLinks
