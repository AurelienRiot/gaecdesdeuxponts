"use server";

import prismadb from "@/lib/prismadb";
import { checkUser } from "../auth/checkAuth";
import { type BugReportValues, bugReportSchema } from "./bug-report-schema";
import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";
import ContactSend from "../email/contact-send";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;
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

  if (process.env.NODE_ENV === "production") {
    await transporter
      .sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: "pub.demystify390@passmail.net",
        subject: "[BUG REPORT] - Laiterie du Pont Robert",
        html: render(
          ContactSend({
            baseUrl,
            url: `${baseUrl}/admin/contacts`,
            name: contact.name,
            message: contact.message,
          }),
        ),
      })
      .catch((error) => console.error(error));
  }
}

export { createBugReport };
