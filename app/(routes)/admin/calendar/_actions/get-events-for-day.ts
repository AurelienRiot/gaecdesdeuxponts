"use server";
import { calendarAPI } from "@/lib/api-google";

export async function getEventsForDay(date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const response = await calendarAPI.events.list({
      calendarId: process.env.CALENDAR_ID, // Replace with your calendar ID if it's not the primary calendar
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    if (!events || events.length === 0) {
      return null;
    }

    return events.map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
