import { calendarAPI } from "@/lib/api-google";
import type { ReturnTypeServerAction } from "@/lib/server-action";

async function getEventsList({
  startDate,
  endDate,
}: { startDate: Date; endDate: Date }): Promise<ReturnTypeServerAction<{ id: string | undefined | null }[]>> {
  try {
    const response = await calendarAPI.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return { success: true, message: "Aucun evenement", data: [] };
    }

    return {
      success: true,
      message: "id",
      data: events.map((event) => ({
        id: event.id,
      })),
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, message: "Erreur lors de la recuperation des evenements" };
  }
}

export default getEventsList;
