"use server";

import ContactSend from "@/components/email/contact-send";
import { transporter } from "@/lib/nodemailer";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { render } from "@react-email/render";
import type { Session } from "next-auth";
import type { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";

const baseUrl = process.env.NEXT_PUBLIC_URL as string;

// async function createContact(data: ContactFormValues): Promise<ReturnTypeServerAction<null>> {
//   const isAuth = await getSessionUser();
//   const validatedData = formSchema.safeParse(data);
//   if (!validatedData.success) {
//     return {
//       success: false,
//       message: validatedData.error.message,
//     };
//   }

//   const contact = await prismadb.contact.create({
//     data: {
//       ...data,
//       userId: isAuth ? isAuth.id : null,
//     },
//   });

//   if (process.env.NODE_ENV === "production") {
//     await transporter
//       .sendMail({
//         from: "laiteriedupontrobert@gmail.com",
//         to: "laiteriedupontrobert@gmail.com",
//         subject: "[NOUVEAU MESSAGE] - Laiterie du Pont Robert",
//         html: render(
//           ContactSend({
//             baseUrl,
//             url: `${baseUrl}/admin/contacts`,
//             name: contact.name,
//             message: contact.message,
//           }),
//         ),
//       })
//       .catch((error) => console.error(error));
//   }

//   return { success: true, data: null };
// }

const createContact = async (data: ContactFormValues) =>
  await safeServerAction({
    type: "sessionUser",
    data,
    checkUser: false,
    schema: formSchema,
    serverAction: async (data: ContactFormValues, user: Session["user"] | null) => {
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
    },
  });

export { createContact };
