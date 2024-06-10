"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";

async function createContact(data: ContactFormValues): Promise<void> {
  const isAuth = await checkUser();
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(`Erreur de validation`);
  }

  const contact = await prismadb.contact.create({
    data: {
      ...data,
      userId: isAuth ? isAuth.id : null,
    },
  });
}

export { createContact };
