"use server";

import { checkReadOnlyAdmin } from "@/components/auth/checkAuth";
import { directionGoogle } from "@/components/google-events/direction-google";
import safeServerAction from "@/lib/server-action";
import { directionSchema, type DirectionFormValues } from "../_components/direction-schema";

async function getDirection(data: DirectionFormValues) {
  return await safeServerAction({
    data,
    getUser: checkReadOnlyAdmin,
    schema: directionSchema,
    serverAction: async ({ destination, origin, waypoints }) => {
      const orderedWaipoints = await directionGoogle({
        origin: origin.label,
        destination: destination.label,
        waypoints: waypoints.map((waypoint) => waypoint.label),
      });
      if (!orderedWaipoints.success) {
        return { success: false, message: orderedWaipoints.message };
      }
      return { success: true, data: orderedWaipoints.data, message: "Trajet optimisé" };
    },
  });
}

export default getDirection;
