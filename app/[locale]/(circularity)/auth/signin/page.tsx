"use client"
import { signIn } from "next-auth/react"
import { ChangeEvent, FormEvent, useState } from "react"
import { useTranslations } from "next-intl"

type LoginInput = {
  username: string
  password: string
}

type PageProps = {
  searchParams: { error?: string }
}

export default function LoginPage({ searchParams }: PageProps) {
  const t = useTranslations("CircularityTool.sections.signin")
  const [inputs, setInputs] = useState<LoginInput>({ username: "", password: "" })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await signIn("credentials", {
      username: inputs.username,
      password: inputs.password,
      callbackUrl: "/",
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 bg-white p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{t("title")}</h2>
          <p className="mt-2 ">
            <span className="text-gray-600">{t("subTitle.a")}</span>
            <a href="https://www.bauteileditor.de" target="_blank" className="text-blue-600 underline">
              {t("subTitle.b")}
            </a>{" "}
            <span className="text-gray-600">{t("subTitle.c")}</span>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-600">
              {t("form.usernameLabel")}
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                placeholder={t("form.usernamePlaceholder")}
                required
                value={inputs.username || ""}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-600">
                {t("form.passwordLabel")}
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="off"
                placeholder={t("form.passwordPlaceholder")}
                required
                value={inputs.password || ""}
                onChange={handleChange}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {t("form.loginButton")}
            </button>
          </div>
          {searchParams.error && <p className="text-center capitalize text-red-600">{t("form.errorMessage")}</p>}
        </form>
      </div>
    </div>
  )
}
