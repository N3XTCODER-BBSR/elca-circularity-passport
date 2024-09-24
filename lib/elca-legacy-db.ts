import { Pool, types } from "pg"
import { env } from "env.mjs"

const parseDate = (val: string) => (val === null ? null : new Date(val))

types.setTypeParser(types.builtins.DATE, parseDate)
types.setTypeParser(types.builtins.TIMESTAMP, parseDate)
types.setTypeParser(types.builtins.TIMESTAMPTZ, parseDate)

const pool = new Pool({
  min: 5,
  max: 10,
  connectionString: env.ELCA_LEGACY_DATABASE_URL,
  ssl: env.ELCA_LEGACY_DATABASE_HAS_SSL
    ? {
        // ca: fs.readFileSync('./sqlca_old_elca_db.pem').toString(),
        // TODO: IMPORTANT - later change this and:
        // 1. add the certificate to the project
        // 2. set the path to the certificate
        // 3. set 'rejectUnauthorized' to true
        // check via process.env.NODE_ENV === 'production'
        rejectUnauthorized: false, // set to true in production
      }
    : false,
})

export const getNewQueryClient = async () => {
  const client = await pool.connect()
  return client
}

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect()
  try {
    console.log("legacy-elca-db: trying to connect...")
    const result = await client.query(text, params)
    console.log("legacy-elca-db: connection successfull")
    return result
  } catch (e) {
    console.error("legacy-elca-db: connection failed")
    console.error(e)
    throw e
  } finally {
    client.release()
  }
}
