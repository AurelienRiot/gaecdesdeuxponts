"use server";
import safeServerAction from "@/lib/server-action";
import { schema } from "../_components/schema";
import type z from "zod";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";
import { ADMIN } from "@/components/auth";

export default async function addNewStock(data: z.infer<typeof schema>) {
  return await safeServerAction({
    schema,
    data,
    roles: ADMIN,
    serverAction: async ({ name, totalQuantity }) => {
      await prismadb.stock.create({
        data: {
          name,
          totalQuantity,
        },
      });
      revalidateTag("stocks");
      return { success: true, message: "Stock ajouté" };
    },
  });
}
