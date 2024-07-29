import { z } from "zod";
import dotenv from "dotenv";

const env =
  process.env.NODE_ENV === "development" ? dotenv.config().parsed : process.env;

export const ServerEnvSchema = z.object({
  APP_URL: z.string(),
  MOVIES_API_URL: z.string(),
  MOVIES_AUTH_TOKEN: z.string(),
});

export const SERVER_ENV = ServerEnvSchema.parse({
  ...env,
});
