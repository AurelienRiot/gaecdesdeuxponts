"use client";

import { useConfirm } from "@/components/ui/confirm-dialog";
import { useToastPromise } from "@/components/ui/sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useServerAction from "@/hooks/use-server-action";
import base64ToBlob from "@/lib/base-64-to-blob";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import { saveAs } from "file-saver";
import { CalendarIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import getOrderForConfirmation from "../server-actions/get-order-for-confirmation";
import { createShippingPDF64StringAction } from "../server-actions/pdf64-string-actions";
import { SendBL } from "../server-actions/send-bl-action";
import { PdfButton } from "./pdf-button";
import { useOrdersQueryClient } from "@/app/(routes)/admin/calendar/_components/orders-query";

export function DisplayShippingOrder({
  orderId,
  isSend,
  disabled,
}: { orderId: string; isSend: boolean; disabled?: boolean }) {
  const { toastServerAction, loading: toastLoading } = useToastPromise({
    serverAction: SendBL,
    message: "Envoi du BL",
    errorMessage: "Envoi du BL annulé",
  });
  const { serverAction, loading } = useServerAction(createShippingPDF64StringAction);
  const { serverAction: orderAction, loading: loading2 } = useServerAction(getOrderForConfirmation);
  const router = useRouter();
  const { refectOrders } = useOrdersQueryClient();
  const confirm = useConfirm();

  const onViewFile = async () => {
    function onSuccess(result?: { base64String: string; userId: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
    await serverAction({ data: { orderId }, onSuccess });
  };

  const onSaveFile = async () => {
    function onSuccess(result?: { base64String: string; userId: string }) {
      if (!result) {
        toast.error("Erreur");
        return;
      }
      const blob = base64ToBlob(result.base64String);
      saveAs(blob, `Bon de livraison ${orderId}.pdf`);
    }
    await serverAction({ data: { orderId }, onSuccess });
  };

  const onSendFile = async (setSend: (send: boolean) => void) => {
    const order = await orderAction({ data: { orderId } });
    if (!order) {
      toast.error("Erreur");
      return;
    }
    if (!order.user.email) {
      toast.error("Le client n'a pas d'email");
      return;
    }

    if (!order.user.completed) {
      router.push(`/admin/users/${order.user.id}?incomplete=true`);
      toast.error("Utilisateur incomplet", { position: "top-center" });
      return;
    }
    const result = await confirm({
      title: "Confirmation de l'envoi du BL",
      content: ModalDescription({
        date: order.dateOfShipping,
        email: order.user.email,
        items: order.orderItems,
        name: order.user.name,
        company: order.user.company,
        image: order.user?.image,
      }),
    });
    if (!result) {
      return;
    }
    toastServerAction({
      data: { orderId },
      onSuccess: () => {
        setSend(true);
        refectOrders();
      },
    });
  };

  return (
    <PdfButton
      disabled={loading || toastLoading || loading2 || disabled}
      onViewFile={onViewFile}
      onSaveFile={onSaveFile}
      onSendFile={onSendFile}
      isSend={isSend}
    />
  );
}

export const ModalDescription = ({
  name,
  company,
  date,
  items,
  image,
  email,
}: {
  name?: string | null;
  company?: string | null;
  image?: string | null;
  date?: Date | null;
  email?: string;
  items: { name: string; price: number; quantity: number; itemId: string }[];
}) => {
  if (!name) {
    return "Aucun utilisateur selectioné";
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-2 mt-2  text-muted-foreground">
        <div className="flex gap-2 items-center ">
          {image ? (
            <Image src={image} width={20} height={20} alt={name} className="object-contain rounded-sm " />
          ) : (
            <UserIcon className="w-5 h-5" />
          )}
          <span className="font-semibold">{company || name}</span>
        </div>
        <div className="flex items-center gap-2 text-md">
          <CalendarIcon className="w-4 h-4" />
          {date ? (
            <span className="font-bold">{dateFormatter(date, { days: true })}</span>
          ) : (
            <span className="font-bold text-destructive">Aucune date de livraison</span>
          )}
        </div>
        <span className="mb-2">{email}</span>
      </div>
      <div className="my-4 relative ">
        <div className="overflow-y-auto h-full max-h-[35dvh] pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Produit</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm">
              {items.map((item, index) => (
                <TableRow
                  key={item.itemId + index}
                  className={
                    item.quantity < 0
                      ? " bg-red-300 hover:bg-red-100 text-black rounded-sm"
                      : "bg-green-300 hover:bg-green-100 rounded-sm text-black"
                  }
                >
                  <TableCell className="font-medium p-2">{item.name}</TableCell>
                  <TableCell className="text-right text-base p-2">{item.quantity}</TableCell>
                  <TableCell className="text-right p-2">{currencyFormatter.format(item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background from-90% pointer-events-none translate-y-1" />
      </div>
    </>
  );
};
