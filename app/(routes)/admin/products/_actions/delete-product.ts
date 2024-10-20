"use server";
import prismadb from "@/lib/prismadb";
import safeServerAction from "@/lib/server-action";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

async function deleteProduct(data: z.infer<typeof schema>) {
  return await safeServerAction({
    data,
    schema,
    roles: ["admin"],
    serverAction: async (data) => {
      const { id } = data;
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
      revalidateTag("products");
      revalidateTag("categories");
      return {
        success: true,
        message: "Produit supprimé",
      };
    },
  });
}

export default deleteProduct;
