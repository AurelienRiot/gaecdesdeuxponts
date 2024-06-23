"use server";

import prismadb from "@/lib/prismadb";
import { checkUser } from "../auth/checkAuth";
import { type BugReportValues, bugReportSchema } from "./bug-report-schema";

async function createBugReport(data: BugReportValues): Promise<void> {
  const isAuth = await checkUser();
  const validatedData = bugReportSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`Erreur de validation`);
  }

  const contact = await prismadb.contact.create({
    data: {
      subject: data.subject,
      message: data.message,
      name: isAuth ? isAuth.name || "" : "",
      email: isAuth ? isAuth?.email || "" : "",
      userId: isAuth ? isAuth.id : null,
    },
  });
}

export { createBugReport };
