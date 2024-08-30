import { z } from "zod";

const envVariableSchema = z.object({
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  NODEMAILER_EMAIL: z.string(),
  NODEMAILER_PASSWORD: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string(),
  NEXT_PUBLIC_FARM_ID: z.string(),
  GOOGLE_SERVICE_ACCOUNT: z.string(),
  CALENDAR_ID: z.string(),
  GOOGLE_API_KEY: z.string(),
  NEXT_PUBLIC_GOOGLE_DIR_URL: z.string(),
});

envVariableSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariableSchema> {}
  }
}
