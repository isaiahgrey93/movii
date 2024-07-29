import { z } from "zod";
import dotenv from "dotenv";

export const ClientEnvSchema = z.object({
  APP_URL: z.string(),
});

export const CLIENT_ENV = ClientEnvSchema.parse({
  ...dotenv.config().parsed,
});
