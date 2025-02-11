import { buildDalProxyInstance } from "./utils"
import { DbDal } from "./db"
import { LegacyDbDal } from "./legacyDb"

declare global {
  var __legacyDbDalInstance: LegacyDbDal | null
  var __dbDalInstance: DbDal | null
}

const _legacyDbDalInstance = globalThis.__legacyDbDalInstance ?? buildDalProxyInstance(new LegacyDbDal())
const _dbDalInstance = globalThis.__dbDalInstance ?? buildDalProxyInstance(new DbDal())

if (process.env.NODE_ENV !== "production") {
  globalThis.__legacyDbDalInstance = _legacyDbDalInstance
  globalThis.__dbDalInstance = _dbDalInstance
}

export { _legacyDbDalInstance as legacyDbDalInstance, _dbDalInstance as dbDalInstance }
