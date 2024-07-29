import { z } from "zod";
import dotenv from "dotenv";

export const ServerEnvSchema = z.object({
  APP_URL: z.string(),
  MOVIES_API_URL: z.string(),
  MOVIES_AUTH_TOKEN: z.string(),
});

export const SERVER_ENV = ServerEnvSchema.parse({
  ...dotenv.config().parsed,
});
