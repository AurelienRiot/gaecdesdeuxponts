"use server";

import safeServerAction from "@/lib/server-action";
import { type DirectionFormValues, directionSchema } from "../_components/direction-schema";
import { checkAdmin } from "@/components/auth/checkAuth";
import { directionGoogle } from "@/components/google-events/direction-google";

async function getDirection(data: DirectionFormValues) {
  return await safeServerAction({
    data,
    getUser: checkAdmin,
    schema: directionSchema,
    serverAction: async ({ destination, origin, waypoints }) => {
      const orderedWaipoints = await directionGoogle({ origin, destination, waypoints });
      if (!orderedWaipoints.success) {
        return { success: false, message: orderedWaipoints.message };
      }
      return { success: true, data: orderedWaipoints.data, message: "Trajet optimisé" };
    },
  });
}

export default getDirection;
