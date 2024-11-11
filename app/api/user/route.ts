import getUser from "@/actions/get-user";
import { safeRouteAPI } from "@/lib/server-action";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return await safeRouteAPI({
    searchParamsReq: true,
    request,
    serverError: "[GET_USERS_FOR_PROFILE]",
    serverAction: async (_, { id }) => {
      const user = await getUser(id);

      if (!user) {
        return {
          success: false,
          message: "Utilisateur introuvable",
        };
      }
      return { success: true, data: user, message: "" };
    },
  });
}
