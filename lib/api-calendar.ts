import { google } from "googleapis";

const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

const auth = new google.auth.GoogleAuth({
  credentials: key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

export const calendarAPI = google.calendar({ version: "v3", auth });
