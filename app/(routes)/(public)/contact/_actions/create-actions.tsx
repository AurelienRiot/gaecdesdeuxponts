"use server";

import { checkUser } from "@/components/auth/checkAuth";
import prismadb from "@/lib/prismadb";
import { ReturnTypeServerAction } from "@/types";
import { ContactFormValues } from "../_components/contact-form";
import { formSchema } from "../_components/shema";

async function createContact(
  data: ContactFormValues,
): Promise<ReturnTypeServerAction<null>> {
  const isAuth = await checkUser();
  const validatedData = formSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      success: false,
      message: "Veuillez remplir tous les champs",
    };
  }

  if (!isAuth) {
    const contact = await prismadb.contact.create({
      data,
    });
    return {
      success: true,
      data: null,
    };
  }

  const contact = await prismadb.contact.create({
    data: {
      ...data,
      userId: isAuth.id,
    },
  });

  return {
    success: true,
    data: null,
  };
}

export { createContact };
