"use server";
import { SHIPPING_ONLY } from "@/components/auth";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  id: z.string().min(1, { message: "Le nom est obligatoire" }),
  quantity: z.coerce.number(),
});
export default async function updateStock(formdata: FormData) {
  await safeServerAction({
    schema,
    roles: SHIPPING_ONLY,
    data: Object.fromEntries(formdata.entries()) as unknown as z.infer<typeof schema>,
    serverAction: async ({ id, quantity }) => {
      console.log({ id, quantity });
      // revalidateTag("stocks");
      return { success: true, message: "" };
    },
  });
}
