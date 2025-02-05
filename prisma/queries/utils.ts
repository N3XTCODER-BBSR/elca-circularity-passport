import { DalError } from "lib/errors"
import { LegacyDbDal } from "./legacyDb"
import { DbDal } from "./db"

export const buildDalProxyInstance = <T extends LegacyDbDal | DbDal>(dal: T) => {
  return new Proxy<T>(dal, {
    get(target, propKey, receiver) {
      const originalProperty = Reflect.get(target, propKey, receiver)

      if (typeof originalProperty === "function") {
        return async (...args: unknown[]) => {
          try {
            return await originalProperty.apply(target, args)
          } catch (error: any) {
            throw new DalError(error)
          }
        }
      }

      return originalProperty
    },
  })
}
