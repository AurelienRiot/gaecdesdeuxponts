"use client";

import { sendMonthlyInvoice } from "@/components/pdf/server-actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { useToastPromise } from "@/components/ui/sonner";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import type { Role } from "@prisma/client";
import { LetterText, MailCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type GroupedInvoiceProps = {
  proUserWithOrders: {
    id: string;
    name: string;
    role: Role;
    image?: string;
    orders: {
      id: string;
      totalPrice: number;
      dateOfPayment: Date | null;
      dateOfShipping: Date | null;
      invoiceEmail: Date | null;
    }[];
  }[];
};

function GroupedInvoicePage({ proUserWithOrders }: GroupedInvoiceProps) {
  const [showModal, setShowModal] = useState(false);
  const { loading, toastServerAction } = useToastPromise({
    serverAction: sendMonthlyInvoice,
    message: "Envoi de la facture mensuelle",
    errorMessage: "Envoi de la facture mensuelle annulé",
  });
  const [orderIdsRecord, setOrderIdsRecord] = useState<Record<string, string[]>>(
    proUserWithOrders.reduce(
      (acc, user) => {
        acc[user.id] = user.orders.map((order) => order.id);
        return acc;
      },
      {} as Record<string, string[]>,
    ),
  );

  async function sendInvoices() {
    const orderIdsArray = Object.values(orderIdsRecord).filter((orderIds) => orderIds.length > 0);
    orderIdsArray.map((orderIds, index) => {
      function onSuccess() {
        toast.success(`Facture ${index + 1} sur ${orderIdsArray.length}  envoyées`);
      }
      if (orderIds.length > 0) {
        toastServerAction({ data: { orderIds }, delay: false, onSuccess });
      }
    });
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)}> Envoie groupé de facture</Button>
      <Modal
        className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[700px] overflow-y-scroll rounded-md"
        title="Envoie groupé de facture"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <Accordion type="multiple" className="relative  flex w-full flex-col gap-4">
          {proUserWithOrders.map((user, index) => {
            const ordersId = orderIdsRecord[user.id];
            const invoiceSend = user.orders.every((order) => order.invoiceEmail);
            const totalPrice = user.orders.reduce((acc, order) => acc + order.totalPrice, 0);
            return (
              <AccordionItem key={index} value={user.name} className="relative">
                <label htmlFor={user.name} className="absolute -left-2 top-2 size-10  flex items-center justify-center">
                  <Checkbox
                    id={user.name}
                    checked={ordersId.length > 0}
                    onCheckedChange={(check) =>
                      setOrderIdsRecord((prev) =>
                        check
                          ? { ...prev, [user.id]: user.orders.map((order) => order.id) }
                          : { ...prev, [user.id]: [] },
                      )
                    }
                  />{" "}
                </label>
                <AccordionTrigger className="ml-8 lining-nums">
                  <div>
                    {!!user.image && (
                      <Image
                        width={24}
                        height={24}
                        src={user.image}
                        alt={user.name}
                        className="rounded-sm object-contain inline mr-2"
                      />
                    )}
                    {user.name},{" "}
                    <span className="text-gray-500">
                      {ordersId.length} commandes ({currencyFormatter.format(totalPrice)})
                    </span>
                    {invoiceSend ? <MailCheck className="size-4 inline ml-2 text-green-500" /> : null}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-4  py-2 text-sm  ">
                    {user.orders.map((order, pointIndex) => (
                      <li key={pointIndex}>
                        <label
                          htmlFor={order.id}
                          className="mx-4 flex gap-2 justify-start
                       items-center"
                        >
                          <Checkbox
                            id={order.id}
                            checked={ordersId.includes(order.id)}
                            onCheckedChange={(check) =>
                              setOrderIdsRecord((prev) => {
                                const updatedOrders = check
                                  ? [...prev[user.id], order.id]
                                  : prev[user.id].filter((id) => id !== order.id);
                                return { ...prev, [user.id]: updatedOrders };
                              })
                            }
                            className="mr-2"
                          />
                          <span>
                            {dateFormatter(order.dateOfShipping || new Date())} :{" "}
                            {currencyFormatter.format(order.totalPrice)}{" "}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <Button disabled={loading} className="mt-4" onClick={sendInvoices}>
          Envoyer les factures
        </Button>
      </Modal>
    </>
  );
}

export default GroupedInvoicePage;
