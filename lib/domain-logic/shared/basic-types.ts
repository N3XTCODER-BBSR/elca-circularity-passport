import translationsPlattformGeneric from "messages/de"

export type ComponentWithBasicFields = {
  // TODO (M): revise naming here
  dinComponentLevelNumber: number
  uuid: string
  name: string
}

type ErrorKeys = keyof (typeof translationsPlattformGeneric)["errors"]
type ErrorI18nKey = `errors.${ErrorKeys & string}`

export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  errorLevel?: "info" | "warning" | "error"
  errorI18nKey?: ErrorI18nKey
  details?: unknown
}
