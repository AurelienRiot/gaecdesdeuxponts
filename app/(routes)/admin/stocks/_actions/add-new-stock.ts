"use server";
import safeServerAction from "@/lib/server-action";
import { schema } from "../_components/schema";
import type z from "zod";
import prismadb from "@/lib/prismadb";
import { revalidateTag } from "next/cache";

export default async function addNewStock(data: z.infer<typeof schema>) {
  return await safeServerAction({
    schema,
    data,
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
