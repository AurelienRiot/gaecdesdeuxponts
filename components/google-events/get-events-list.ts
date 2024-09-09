import { calendarAPI } from "@/lib/api-google";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import type { calendar_v3 } from "googleapis";

async function getEventsList({
  startDate,
  endDate,
}: { startDate: Date; endDate: Date }): Promise<ReturnTypeServerAction<calendar_v3.Schema$Event[]>> {
  try {
    const response = await calendarAPI.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      timeZone: "Europe/Paris",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return { success: true, message: "Aucun evenement", data: [] };
    }

    return {
      success: true,
      message: "id",
      data: events,
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, message: "Erreur lors de la recuperation des evenements" };
  }
}

export default getEventsList;
