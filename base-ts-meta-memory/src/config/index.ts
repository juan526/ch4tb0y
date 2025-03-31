import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3008'),
  OPENAI_API_KEY: z.string(),
  jwtToken: z.string(),
  numberId: z.string(),
  verifyToken: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
});

export const config = envSchema.parse(process.env);