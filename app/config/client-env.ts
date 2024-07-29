import { z } from "zod";
import dotenv from "dotenv";

const env =
  process.env.NODE_ENV === "development" ? dotenv.config().parsed : process.env;

export const ClientEnvSchema = z.object({
  APP_URL: z.string(),
});

export const CLIENT_ENV = ClientEnvSchema.parse({
  ...env,
});
