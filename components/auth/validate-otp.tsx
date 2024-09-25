"use server";
import safeServerAction from "@/lib/server-action";
import type { z } from "zod";
import { optSchema } from "../zod-schema";
import prismadb from "@/lib/prismadb";

async function validateOTP(data: z.infer<typeof optSchema>) {
  return await safeServerAction({
    data,
    schema: optSchema,
    getUser: async () => {},
    ignoreCheckUser: true,
    serverAction: async ({ otp, email }) => {
      const verificationToken = await prismadb.verificationToken.findFirst({
        where: {
          identifier: email,
        },
        orderBy: {
          expires: "desc",
        },
      });
      if (!verificationToken?.url || !verificationToken.otp) {
        return {
          success: false,
          message: "Une erreur est survenue",
          errorData: "refresh",
        };
      }
      if (verificationToken.expires.getTime() < new Date().getTime()) {
        return {
          success: false,
          message: "Le code a expire",
          errorData: "refresh",
        };
      }
      if (otp !== verificationToken.otp) {
        return {
          success: false,
          message: "Le code est incorrect",
        };
      }
      return {
        success: true,
        message: "Code valide",
        data: verificationToken.url,
      };
    },
  });
}

export default validateOTP;
