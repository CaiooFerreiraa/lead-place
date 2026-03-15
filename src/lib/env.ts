import { z } from "zod";

const envSchema = z.object({
  API_KEY: z.string().min(1),
  API_BASE_URL: z.string().url().default("https://gnarly-unconcertable-fransisca.ngrok-free.dev"),
});

export const env = envSchema.parse({
  API_KEY: process.env.API_KEY,
  API_BASE_URL: process.env.API_BASE_URL,
});
