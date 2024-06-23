"use server";

import { getSessionUser } from "@/actions/get-user";
import prismadb from "@/lib/prismadb";
import type { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";

async function createContact(data: ContactFormValues): Promise<void> {
  const isAuth = await getSessionUser();
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error(validatedData.error.message);
  }

  const contact = await prismadb.contact.create({
    data: {
      ...data,
      userId: isAuth ? isAuth.id : null,
    },
  });
}

export { createContact };
