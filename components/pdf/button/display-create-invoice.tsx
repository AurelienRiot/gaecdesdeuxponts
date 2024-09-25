"use client";

import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import useServerAction from "@/hooks/use-server-action";
import { createInvoiceAction } from "../server-actions/create-send-invoice-action";
import { useConfirm } from "@/components/ui/confirm-dialog";
import getOrderForConfirmation from "../server-actions/get-order-for-confirmation";
import { toast } from "sonner";
import { ModalDescription } from "./display-shipping-order";

export const DisplayCreateInvoice = ({ orderIds, disabled }: { orderIds: string[]; disabled?: boolean }) => {
  const { serverAction, loading } = useServerAction(createInvoiceAction);
  const { serverAction: orderAction, loading: loading2 } = useServerAction(getOrderForConfirmation);
  const confirm = useConfirm();

  const onCreateInvoice = async (sendEmail: boolean) => {
    if (orderIds.length === 1) {
      const order = await orderAction({ data: { orderId: orderIds[0] } });
      if (!order) {
        toast.error("Erreur");
        return;
      }

      const result = await confirm({
        title: "Confirmation de de commande",
        content: ModalDescription({
          date: order.dateOfShipping,
          email: order.user.email || "",
          items: order.orderItems,
          name: order.user.name,
          company: order.user.company,
          image: order.user?.image,
        }),
      });

      if (!result) {
        return;
      }
    }
    serverAction({ data: { orderIds, sendEmail } });
  };

  return (
    <div className="flex flex-wrap gap-1">
      <Button onClick={() => onCreateInvoice(false)} type="button" disabled={loading || loading2 || disabled}>
        {loading && <Spinner className="h-5 w-5 mr-2" />}
        Créer
      </Button>
      <Button onClick={() => onCreateInvoice(true)} type="button" disabled={loading || loading2 || disabled}>
        {loading && <Spinner className="h-5 w-5 mr-2" />}
        Créer et envoyer par mail
      </Button>
    </div>
  );
};