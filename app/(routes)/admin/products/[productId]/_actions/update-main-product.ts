"use server";

import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { type MainProductFormValues, mainProductSchema } from "../_components/product-schema";

export async function updateMainProduct(data: MainProductFormValues) {
  return await safeServerAction({
    data,
    schema: mainProductSchema,
    roles: ADMIN,
    serverAction: async ({ id, ...data }) => {
      const sameProduct = await prismadb.mainProduct.findUnique({
        where: {
          name: data.name,
          NOT: { id },
        },
      });
      if (sameProduct) {
        return {
          success: false,
          message: "Un produit avec ce nom existe déja",
        };
      }

      await prismadb.mainProduct.update({
        where: {
          id,
        },
        data,
      });
      revalidateProducts(id);

      return {
        success: true,
        message: "Produit mis à jour",
      };
    },
  });
}
