"use server";

import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { render } from "@react-email/render";
import ContactSend from "../email/contact-send";
import { bugReportSchema, type BugReportValues } from "./bug-report-schema";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;
async function createBugReport(data: BugReportValues) {
  return await safeServerAction({
    schema: bugReportSchema,
    data,
    serverAction: async (data, user) => {
      const contact = await prismadb.contact.create({
        data: {
          subject: data.subject,
          message: data.message,
          name: user ? user.name || "" : "",
          email: user ? user?.email || "" : "",
          userId: user ? user.id : null,
        },
      });

      if (process.env.NODE_ENV === "production") {
        await transporter
          .sendMail({
            from: "laiteriedupontrobert@gmail.com",
            to: "pub.demystify390@passmail.net",
            subject: "[BUG REPORT] - Laiterie du Pont Robert",
            html: await render(
              ContactSend({
                baseUrl,
                url: `${baseUrl}/admin/contacts?emaillogin=${encodeURIComponent("laiteriedupontrobert@gmail.com")}`,
                name: contact.name,
                message: contact.message,
              }),
            ),
          })
          .catch((error) => console.error(error));
      }

      return { success: true, message: "Message envoyé" };
    },
  });
}

export { createBugReport };
