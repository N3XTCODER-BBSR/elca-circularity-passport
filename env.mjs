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
    RUN_SEEDERS_ON_DEPLOY: z.boolean().optional(),
  },
  client: {},
  runtimeEnv: {
    ANALYZE: process.env.ANALYZE,
    DATABASE_URL: process.env.DATABASE_URL,
    HTTP_BASIC_AUTH: process.env.HTTP_BASIC_AUTH,
    RUN_SEEDERS_ON_DEPLOY: process.env.RUN_SEEDERS_ON_DEPLOY
  },
})
