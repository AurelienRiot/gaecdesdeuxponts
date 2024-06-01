"use server";

import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";
import { checkUser } from "../auth/checkAuth";
import { BugReportValues, bugReportSchema } from "./bug-report-schema";

async function createBugReport(
  data: BugReportValues,
): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkUser();
  const validatedData = bugReportSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`Erreur de validation`);
  }

  const contact = await prismadb.contact.create({
    data: {
      subject: "RAPPORT DE BUG",
      message: data.message,
      name: isAuth ? isAuth.name || "" : "",
      email: isAuth ? isAuth?.email || "" : "",
      userId: isAuth ? isAuth.id : null,
    },
  });

  return {
    success: true,
    data: null,
  };
}

export { createBugReport };
