"use client";

import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import { createInvoiceAction } from "../server-actions/create-send-invoice-action";

export const DisplayCreateInvoice = ({ orderIds }: { orderIds: string[] }) => {
  const { serverAction, loading } = useServerAction(createInvoiceAction);

  const onCreateInvoice = async (sendEmail: boolean) => {
    serverAction({ data: { orderIds, sendEmail } });
  };

  return (
    <div className="flex flex-wrap gap-1">
      <Button onClick={() => onCreateInvoice(false)} type="button" disabled={loading}>
        {loading && <Spinner className="h-5 w-5 mr-2" />}
        Créer
      </Button>
      <Button onClick={() => onCreateInvoice(true)} type="button" disabled={loading}>
        {loading && <Spinner className="h-5 w-5 mr-2" />}
        Créer et envoyer par mail
      </Button>
    </div>
  );
};
