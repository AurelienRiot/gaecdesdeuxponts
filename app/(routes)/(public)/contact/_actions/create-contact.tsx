"use server";

import { getSessionUser } from "@/actions/get-user";
import ContactSend from "@/components/email/contact-send";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import { render } from "@react-email/render";
import type { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";
import type { ReturnTypeServerAction } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

async function createContact(data: ContactFormValues): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await getSessionUser();
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: validatedData.error.message,
    };
  }

  const contact = await prismadb.contact.create({
    data: {
      ...data,
      userId: isAuth ? isAuth.id : null,
    },
  });

  if (process.env.NODE_ENV === "production") {
    await transporter
      .sendMail({
        from: "laiteriedupontrobert@gmail.com",
        to: "laiteriedupontrobert@gmail.com",
        subject: "[NOUVEAU MESSAGE] - Laiterie du Pont Robert",
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

  return { success: true, data: null };
}

export { createContact };
