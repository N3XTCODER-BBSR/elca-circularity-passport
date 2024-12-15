import Link from "next/link"
import { twMerge } from "tailwind-merge"

type NavigationLinksProps = {
  navigation: { id: string; name: string; href: string }[]
  curNaviElIdx?: number
}

const NavigationLinks = ({ navigation, curNaviElIdx }: NavigationLinksProps) => (
  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
    <div className="hidden sm:flex sm:space-x-8">
      {navigation.map((item, idx) => (
        <Link
          key={item.name}
          href={item.href}
          className={twMerge(
            curNaviElIdx === idx
              ? "border-indigo-500 text-gray-900"
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
          )}
          aria-current={curNaviElIdx === idx ? "page" : undefined}
        >
          {item.name}
        </Link>
      ))}
    </div>
  </div>
)

export default NavigationLinks
