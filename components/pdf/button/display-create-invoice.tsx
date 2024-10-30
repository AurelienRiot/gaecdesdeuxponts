"use client";

import { useOrdersQueryClient } from "@/app/(routes)/admin/calendar/_components/orders-query";
import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui/confirm-dialog";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createInvoiceAction } from "../server-actions/create-send-invoice-action";
import getOrderForConfirmation from "../server-actions/get-order-for-confirmation";
import { ModalDescription } from "./display-shipping-order";

export const DisplayCreateInvoice = ({ orderIds, disabled }: { orderIds: string[]; disabled?: boolean }) => {
  const { serverAction, loading } = useServerAction(createInvoiceAction);
  const { serverAction: orderAction, loading: loading2 } = useServerAction(getOrderForConfirmation);
  const { refectOrders } = useOrdersQueryClient();
  const confirm = useConfirm();

  const router = useRouter();

  const onCreateInvoice = async (sendEmail: boolean) => {
    if (orderIds.length === 1) {
      const order = await orderAction({ data: { orderId: orderIds[0] } });
      if (!order) {
        toast.error("Erreur");
        return;
      }

      if (!order.user.completed && sendEmail) {
        router.push(`/admin/users/${order.user.id}?incomplete=true`);
        toast.error("Utilisateur incomplet", { position: "top-center" });
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
    serverAction({
      data: { orderIds, sendEmail },
      onSuccess: () => {
        refectOrders();
        router.refresh();
      },
    });
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
