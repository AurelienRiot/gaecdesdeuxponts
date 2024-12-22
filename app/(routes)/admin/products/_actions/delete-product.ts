"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteMainProduct(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async ({ id }) => {
      try {
        await prismadb.mainProduct.delete({
          where: { id },
        });
      } catch (e) {
        console.log(e);
        return {
          success: false,
          message: "Une erreur est survenue",
        };
      }
      revalidateProducts(id);
      return {
        success: true,
        message: "Produit supprimé",
      };
    },
  });
}

export default deleteMainProduct;
