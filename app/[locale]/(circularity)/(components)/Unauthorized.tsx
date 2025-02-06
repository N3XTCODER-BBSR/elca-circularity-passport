import Link from "next/link"
import { useTranslations } from "next-intl"

const Unauthorized = () => {
  const t = useTranslations()

  return (
    <div>
      <h2 data-testid="unauthorized-heading">{t("errors.unauthorized")}</h2>
      <p>
        go to <Link href="/projects">my projects</Link>
      </p>
    </div>
  )
}

export default Unauthorized
