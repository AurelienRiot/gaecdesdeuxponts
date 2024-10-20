"use server";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  id: z.string().min(1, { message: "Le nom est obligatoire" }),
  quantity: z.coerce.number(),
});
export default async function updateStock(formdata: FormData) {
  await safeServerAction({
    schema,
    data: Object.fromEntries(formdata.entries()) as unknown as z.infer<typeof schema>,
    serverAction: async ({ id, quantity }) => {
      console.log({ id, quantity });
      // revalidateTag("stocks");
      return { success: true, message: "" };
    },
  });
}
