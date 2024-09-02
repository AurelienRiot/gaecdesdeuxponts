"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, LoadingButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import type { Role } from "@prisma/client";
import ky, { type HTTPError, type TimeoutError } from "ky";
import { MailCheck } from "lucide-react";
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

  const [loading, setLoading] = useState(false);
  const [orderIdsRecord, setOrderIdsRecord] = useState<Record<string, string[]>>(
    proUserWithOrders.reduce(
      (acc, user) => {
        acc[user.id] = user.orders
          .map((order) => (!order.invoiceEmail ? order.id : null))
          .filter((id): id is string => id !== null);
        return acc;
      },
      {} as Record<string, string[]>,
    ),
  );
  const orderIdsArray = Object.values(orderIdsRecord).filter((orderIds) => orderIds.length > 0);

  async function sendInvoices() {
    setLoading(true);
    // const orderIdsArray = [
    //   ["11", "12"],
    //   ["21", "22"],
    //   ["31", "32"],
    //   ["41", "42"],
    //   ["51", "52"],
    //   ["61", "62"],
    //   ["71", "72"],
    //   ["81", "82"],
    //   ["91", "92"],
    //   ["101", "102"],
    //   ["111", "112"],
    //   ["121", "122"],
    //   ["131", "132"],
    //   ["141", "142"],
    //   ["151", "152"],
    //   ["161", "162"],
    //   ["171", "172"],
    //   ["181", "182"],
    //   ["191", "192"],
    //   ["201", "202"],
    // ];
    if (orderIdsArray.length === 0) {
      toast.error("Veuillez sélectionner au moins un client");
      setLoading(false);
      return;
    }
    const chunkSize = 5;
    let cumulativeCount = 0;
    for (let i = 0; i < orderIdsArray.length; i += chunkSize) {
      const chunk = orderIdsArray.slice(i, i + chunkSize);
      const chunkRes = await Promise.all(
        chunk.map((orderIds) => {
          return ky
            .post("/api/grouped-invoice", { json: orderIds, timeout: 15000 })
            .then(async (responce) => {
              const res = await responce.text();
              // toast.success(res);
              return true;
            })
            .catch(async (kyError: HTTPError) => {
              if (kyError.response) {
                const errorData = await kyError.response.text();
                console.error(errorData);
                toast.error(errorData, { duration: 10000 });
              } else {
                const error = kyError as TimeoutError;
                console.error("Erreur timeout");
                // toast.error("Erreur dans l'envoi des factures, veuillez recharger la page");
              }
              return false;
            });
        }),
      );
      if (!chunkRes.every((res) => res)) {
        toast.error("Une erreur est survenue lors de l'envoi des factures, veuillez recharger la page", {
          position: "top-center",
          duration: 10000,
        });
        return;
      }
      cumulativeCount += chunk.length;
      const currentCount = cumulativeCount;
      toast.success(`Facture envoyée ${currentCount} sur ${orderIdsArray.length}`, {
        position: "bottom-center",
      });
      if (currentCount === orderIdsArray.length) {
        toast.success("Toutes les factures sont envoyées", { position: "top-center", duration: 10000 });
      }
    }
    setLoading(false);
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)}> Envoie groupé de facture </Button>
      <Modal
        className="left-[50%] top-[50%] lining-nums max-h-[90%] w-[90%] max-w-[700px] overflow-y-scroll rounded-md"
        title={`Envoie groupé de facture (${orderIdsArray.length})`}
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
                          {order.invoiceEmail ? <MailCheck className="size-4 inline ml-2 text-green-500" /> : null}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <LoadingButton
          disabled={loading}
          variant={"shine"}
          className="mt-4 w-full  from-green-600 via-green-600/80 to-green-600"
          onClick={sendInvoices}
        >
          Envoyer les factures
        </LoadingButton>
      </Modal>
    </>
  );
}

export default GroupedInvoicePage;
