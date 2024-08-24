"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import { getEventsForDay } from "../_actions/get-events-for-day";
import { createEvent } from "@/components/google-events/create-orders-action";

function GoogleCalendar({ date }: { date: Date }) {
  const { loading, serverAction } = useServerAction(createEvent);
  async function create() {
    await serverAction({ data: { date } });

    // await getCalendars();
    // await createCalendar().then((res) => {
    //   toast.success(res.message);
    //   res.calendarId && toast.success(res.calendarId);
    // });
  }
  async function list() {
    const events = await getEventsForDay(date);
    console.log(events);
  }
  return (
    <div className="flex gap-2">
      <LoadingButton disabled={loading} onClick={create}>
        Create Events
      </LoadingButton>
      <Button onClick={list}>List Events</Button>
    </div>
  );
}

export default GoogleCalendar;
