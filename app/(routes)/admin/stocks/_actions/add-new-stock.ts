"use server";
import { ADMIN } from "@/components/auth";
import prismadb from "@/lib/prismadb";
import { revalidateStocks } from "@/lib/revalidate-path";
import safeServerAction from "@/lib/server-action";
import type z from "zod";
import { schema } from "../_components/schema";

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
      revalidateStocks("stocksName");
      return { success: true, message: "Stock ajouté" };
    },
  });
}
