"use server";

import { ADMIN } from "@/components/auth";
import { revalidateProducts } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  checkState: z.literal("indeterminate").or(z.boolean()),
});
const changePro = async (data: z.infer<typeof schema>) => {
  return await safeServerAction({
    data,
    schema,
    roles: ADMIN,
    serverAction: async (data) => {
      const { id, checkState } = data;
      if (checkState === "indeterminate") {
        return {
          success: false,
          message: "Une erreur est survenue, veuillez reessayer",
        };
      }

      revalidateProducts(id);

      return {
        success: true,
        message: checkState ? "Produit en pro" : "Produit non pro",
      };
    },
  });
};

export default changePro;
