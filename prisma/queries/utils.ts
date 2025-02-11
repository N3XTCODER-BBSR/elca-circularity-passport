import { DatabaseError } from "lib/errors"
import { DbDal } from "./db"
import { LegacyDbDal } from "./legacyDb"

export const buildDalProxyInstance = <T extends LegacyDbDal | DbDal>(dal: T) => {
  let database: string

  if (dal instanceof DbDal) {
    database = "new"
  }
  if (dal instanceof LegacyDbDal) {
    database = "legacy"
  }

  return new Proxy<T>(dal, {
    get(target, propKey, receiver) {
      const originalProperty = Reflect.get(target, propKey, receiver)

      if (typeof originalProperty === "function") {
        return async (...args: unknown[]) => {
          const start = Date.now()
          try {
            const result = await originalProperty.apply(target, args)
            const duration = Date.now() - start
            console.log(`[${database} DB]: Call to ${String(propKey)} succeeded in ${duration}ms`)
            return result
          } catch (error: unknown) {
            const duration = Date.now() - start
            console.error(`[${database} DB]: Call to ${String(propKey)} failed in ${duration}ms`)
            throw new DatabaseError(error)
          }
        }
      }

      return originalProperty
    },
  })
}
