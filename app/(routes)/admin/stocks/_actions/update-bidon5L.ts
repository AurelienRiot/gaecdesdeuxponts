"use server";
import safeServerAction from "@/lib/server-action";
import z from "zod";

const schema = z.object({
  bidon5L: z.coerce.number(),
});
export default async function updateBidon5L(formdata: FormData) {
  return await safeServerAction({
    schema,
    data: Object.fromEntries(formdata.entries()) as unknown as z.infer<typeof schema>,
    serverAction: async ({ bidon5L }) => {
      console.log({ bidon5L });
      return { success: true, message: "" };
    },
  });
}
