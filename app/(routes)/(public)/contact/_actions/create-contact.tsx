"use server";

import { getSessionUser } from "@/actions/get-user";
import ContactSend from "@/components/email/contact-send";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { render } from "@react-email/render";
import type { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

const createContact = async (data: ContactFormValues) =>
  await safeServerAction({
    getUser: getSessionUser,
    data,
    ignoreCheckUser: true,
    schema: formSchema,
    serverAction: async (data, user) => {
      const contact = await prismadb.contact.create({
        data: {
          ...data,
          userId: user ? user.id : null,
        },
      });

      if (process.env.NODE_ENV === "production") {
        await transporter
          .sendMail({
            from: "laiteriedupontrobert@gmail.com",
            to: "laiteriedupontrobert@gmail.com",
            subject: "[NOUVEAU MESSAGE] - Laiterie du Pont Robert",
            html: await render(
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

      return { success: true, message: "Message envoyé" };
    },
  });

export { createContact };
