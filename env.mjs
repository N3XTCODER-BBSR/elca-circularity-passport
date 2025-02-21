import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ELCA_LEGACY_DATABASE_URL: z.string().url(),
    ELCA_LEGACY_DATABASE_HAS_SSL: z.enum(["true", "false"]).optional().transform((value) => value === "true"),
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    // Add regex validation for 'ANY_STRING then COLON then ANY_STRING'
    HTTP_BASIC_AUTH: z.string().regex(/^.+:.+$/),
    // RUN_SEEDERS_ON_DEPLOY: a stirng, that is either TRUE or FALSE and will be mapped to a boolean ts type
    DOPPIO_API_KEY: z.string(),
    SEED_INITIAL_DATA: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    SEED_DEMO_DATA: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    NEXT_PUBLIC_PASSPORT_BASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    DATABASE_POOL_MAX_CONN: z.string(),
    DATABASE_POOL_TIMEOUT: z.string(),
    LEGACY_DATABASE_POOL_MAX_CONN: z.string(),
    LEGACY_DATABASE_POOL_TIMEOUT: z.string(),
    S3_BUCKET_NAME: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
    S3_REGION: z.string(),
    S3_ENDPOINT: z.string(),
  },
  client: {
    NEXT_PUBLIC_PASSPORT_BASE_URL: z.string().url(),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    ELCA_LEGACY_DATABASE_URL: process.env.ELCA_LEGACY_DATABASE_URL,
    ELCA_LEGACY_DATABASE_HAS_SSL: process.env.ELCA_LEGACY_DATABASE_HAS_SSL,
    DOPPIO_API_KEY: process.env.DOPPIO_API_KEY,
    HTTP_BASIC_AUTH: process.env.HTTP_BASIC_AUTH,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_PASSPORT_BASE_URL: process.env.NEXT_PUBLIC_PASSPORT_BASE_URL,
    RUN_SEEDERS_ON_DEPLOY: process.env.RUN_SEEDERS_ON_DEPLOY,
    DATABASE_POOL_MAX_CONN: process.env.DATABASE_POOL_MAX_CONN,
    DATABASE_POOL_TIMEOUT: process.env.DATABASE_POOL_TIMEOUT,
    LEGACY_DATABASE_POOL_MAX_CONN: process.env.LEGACY_DATABASE_POOL_MAX_CONN,
    LEGACY_DATABASE_POOL_TIMEOUT: process.env.LEGACY_DATABASE_POOL_TIMEOUT,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
})
