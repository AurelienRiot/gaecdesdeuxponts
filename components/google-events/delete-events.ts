import { calendarAPI } from "@/lib/api-google";
import type { ReturnTypeServerAction } from "@/lib/server-action";

async function deleteEvent(id: string): Promise<ReturnTypeServerAction> {
  return await calendarAPI.events
    .delete({
      calendarId: process.env.CALENDAR_ID,
      eventId: id,
    })
    .then(() => {
      return { success: true, message: "Evenement supprimé" };
    })
    .catch((error) => {
      console.error("Error deleting event:", error);
      return { success: false, message: "Evenement non supprimé" };
    });
}

export default deleteEvent;
