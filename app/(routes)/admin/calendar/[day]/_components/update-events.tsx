"use client";

import { createEvent } from "@/components/google-events/create-orders-action";
import { LoadingButton } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";

function UpdateEvents({ date }: { date: Date }) {
  const { loading, serverAction } = useServerAction(createEvent);
  async function create() {
    await serverAction({ data: { date } });
  }

  return (
    <div className="flex gap-2">
      <LoadingButton disabled={loading} onClick={create}>
        Mettre à jour l'agenda Google
      </LoadingButton>
    </div>
  );
}

export default UpdateEvents;
