import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    ANALYZE: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
    // Add regex validation for 'ANY_STRING then COLON then ANY_STRING'
    HTTP_BASIC_AUTH: z.string().regex(/^.+:.+$/),
    // RUN_SEEDERS_ON_DEPLOY: a stirng, that is either TRUE or FALSE and will be mapped to a boolean ts type
    DOPPIO_API_KEY: z.string(),
    RUN_SEEDERS_ON_DEPLOY: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),
      NEXT_PUBLIC_PASSPORT_BASE_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_PASSPORT_BASE_URL: z.string().url(),
    NEXT_PUBLIC_DOPPIO_PRINT_HOST: z.string(),
  },
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    DOPPIO_API_KEY: process.env.DOPPIO_API_KEY,
    NEXT_PUBLIC_DOPPIO_PRINT_HOST: process.env.NEXT_PUBLIC_DOPPIO_PRINT_HOST,
    HTTP_BASIC_AUTH: process.env.HTTP_BASIC_AUTH,
    RUN_SEEDERS_ON_DEPLOY: process.env.RUN_SEEDERS_ON_DEPLOY,
    NEXT_PUBLIC_PASSPORT_BASE_URL: process.env.NEXT_PUBLIC_PASSPORT_BASE_URL,
  },
})
