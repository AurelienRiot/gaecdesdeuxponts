"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ContactFormValues } from "./contact-form";

export type ContactReturnType = {
  success: boolean;
  message: string;
};

async function createContact({
  email,
  name,
  message,
  phone,
  subject,
}: ContactFormValues): Promise<ContactReturnType> {
  const isAuth = await checkUser();

  if (!isAuth) {
    const contact = await prismadb.contact.create({
      data: {
        name,
        email,
        message,
        phone,
        subject,
      },
    });
    return {
      success: true,
      message: "Message envoyé",
    };
  }

  const contact = await prismadb.contact.create({
    data: {
      name,
      email,
      message,
      phone,
      subject,
      userId: isAuth.id,
    },
  });

  return {
    success: true,
    message: "Message envoyé",
  };
}

export { createContact };
