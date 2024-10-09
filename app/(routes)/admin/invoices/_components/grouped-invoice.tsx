"use client";

import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button, LoadingButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import ky, { type HTTPError, type TimeoutError } from "ky";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import createGroupedMonthlyInvoice from "../_actions/send-grouped-monthly-invoice";
import type { UserWithOrdersForInvoices } from "../_functions/get-users-with-orders";

const createOrderIdsRecord = (proUserWithOrders: UserWithOrdersForInvoices) =>
  proUserWithOrders.reduce(
    (acc, user) => {
      acc[user.id] = user.orders
        .filter((order) => {
          const currentDate = new Date();
          const orderDate = order.dateOfShipping ? new Date(order.dateOfShipping) : new Date();
          return orderDate.getTime() < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
        })
        .map((order) => order.id);
      return acc;
    },
    {} as Record<string, string[]>,
  );

function GroupedInvoicePage({ proUserWithOrders }: { proUserWithOrders: UserWithOrdersForInvoices }) {
  const [showModal, setShowModal] = useState(false);
  const { serverAction } = useServerAction(createGroupedMonthlyInvoice);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [orderIdsRecord, setOrderIdsRecord] = useState(createOrderIdsRecord(proUserWithOrders));
  const orderIdsArray = Object.values(orderIdsRecord).filter((orderIds) => orderIds.length > 0);

  useEffect(() => {
    if (proUserWithOrders) {
      setOrderIdsRecord(createOrderIdsRecord(proUserWithOrders));
    }
  }, [proUserWithOrders]);
  async function sendInvoices(sendEmail: boolean) {
    setLoading(true);
    if (orderIdsArray.length === 0) {
      toast.error("Veuillez sélectionner au moins un client");
      setLoading(false);
      return;
    }

    const chunkSize = 5;
    const response = await serverAction({ data: orderIdsArray }).catch((errorData) => errorData);
    if (!response) {
      toast.error("Une erreur est survenue lors de la création des factures, veuillez recharger la page");
      setLoading(false);
      setShowModal(false);
      router.refresh();
      return;
    }
    if (!sendEmail) {
      console.log(response);
      setLoading(false);
      setShowModal(false);
      router.refresh();
      return;
    }
    toast.success("Envoi des factures en cours...");
    const invoiceIds = (response as (string | undefined)[]).filter(
      (invoiceId): invoiceId is string => typeof invoiceId === "string",
    );
    let cumulativeCount = 0;
    for (let i = 0; i < invoiceIds.length; i += chunkSize) {
      const chunk = invoiceIds.slice(i, i + chunkSize);
      const chunkRes = await Promise.all(
        chunk.map((invoiceId) => {
          return ky
            .post("/api/send-invoice", { json: { invoiceId }, timeout: 15000 })
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
        setShowModal(false);
        router.refresh();
        return;
      }
      cumulativeCount += chunk.length;
      const currentCount = cumulativeCount;
      toast.success(`Facture envoyée : ${currentCount} sur ${orderIdsArray.length}`, {
        position: "bottom-center",
      });
      if (currentCount === orderIdsArray.length) {
        toast.success(`Toutes les factures sont envoyées`, {
          position: "top-center",
          duration: 10000,
        });
      }
    }
    setLoading(false);
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)}> Envoie groupé de facture </Button>
      <Modal
        className="left-[50%] top-[50%] lining-nums max-h-[90%] w-[90%] max-w-[700px] "
        title={`Envoie groupé de facture (${orderIdsArray.length})`}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <Accordion type="multiple" className="relative  flex w-full flex-col gap-4">
          {proUserWithOrders.map((user, index) => {
            const ordersId = orderIdsRecord[user.id];
            const totalPrice = user.orders
              .filter((order) => ordersId.includes(order.id)) // Only include orders in ordersId
              .reduce((acc, order) => acc + order.totalPrice, 0);
            const name = getUserName(user);
            const groupedOrders = user.orders.reduce(
              (acc, order) => {
                if (!order.dateOfShipping) {
                  return acc;
                }
                const date = new Date(order.dateOfShipping);
                const monthYear = dateFormatter(date, { customFormat: "MMMM yyyy" });

                if (!acc[monthYear]) {
                  acc[monthYear] = [];
                }
                acc[monthYear].push(order);

                return acc;
              },
              {} as Record<string, typeof user.orders>,
            );
            return (
              <AccordionItem key={index} value={name} className="relative cursor-pointer">
                <label htmlFor={name} className="absolute -left-2 top-2 size-10  flex items-center justify-center">
                  <Checkbox
                    id={name}
                    checked={ordersId?.length > 0}
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
                  <div className="flex gap-2">
                    <NameWithImage name={name} image={user.image} imageSize={12} />
                    <p className="text-gray-500 flex gap-2 ">
                      <span>{ordersId?.length} </span>
                      <span>commandes</span>

                      <span>({currencyFormatter.format(totalPrice)})</span>
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4  py-2 text-sm  ">
                    {Object.entries(groupedOrders).map(([monthYear, orders], index) => (
                      <ul key={`${monthYear}-${orders[0].id}`}>
                        <label
                          htmlFor={`${monthYear}-${orders[0].id}`}
                          className="mx-4 flex gap-2 justify-start
                       items-center cursor-pointer"
                        >
                          <Checkbox
                            id={`${monthYear}-${orders[0].id}`}
                            checked={orders.some((order) => ordersId?.includes(order.id))} // Check if any order of the month is selected
                            onCheckedChange={(check) =>
                              setOrderIdsRecord((prev) => {
                                const updatedOrders = check
                                  ? [...new Set([...prev[user.id], ...orders.map((order) => order.id)])] // Add all orders of the month
                                  : prev[user.id].filter((id) => !orders.map((order) => order.id).includes(id)); // Remove all orders of the month
                                return { ...prev, [user.id]: updatedOrders };
                              })
                            }
                            className="mr-2"
                          />
                          <span>{monthYear}</span>
                        </label>

                        {orders.map((order, pointIndex) => (
                          <li key={order.id} className="pl-4">
                            <label
                              htmlFor={order.id}
                              className="mx-4 flex gap-2 justify-start
                       items-center cursor-pointer"
                            >
                              <Checkbox
                                id={order.id}
                                checked={ordersId?.includes(order.id)}
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
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <LoadingButton
            disabled={loading}
            variant={"shine"}
            className=" w-fit  from-blue-600 via-blue-600/80 to-blue-600"
            onClick={() => sendInvoices(false)}
          >
            Créer les factures
          </LoadingButton>
          <LoadingButton
            disabled={loading}
            variant={"shine"}
            className="w-fit  from-green-600 via-green-600/80 to-green-600"
            onClick={() => sendInvoices(true)}
          >
            Créer et envoyer les factures
          </LoadingButton>
        </div>
      </Modal>
    </>
  );
}

export default GroupedInvoicePage;
