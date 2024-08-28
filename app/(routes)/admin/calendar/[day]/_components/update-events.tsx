"use client";

import { createEvent } from "@/components/google-events/create-orders-action";
import { LoadingButton } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import { BiCalendarEvent } from "react-icons/bi";

function UpdateEvents({ date }: { date: Date }) {
  const { loading, serverAction } = useServerAction(createEvent);
  async function create() {
    await serverAction({ data: { date } });
  }

  return (
    <div className="flex justify-center mt-4">
      <LoadingButton disabled={loading} onClick={create} className="flex items-center justify-center">
        <BiCalendarEvent className="h-5 w-5 mr-3" /> Mettre à jour l'agenda Google
      </LoadingButton>
    </div>
  );
}

export default UpdateEvents;
