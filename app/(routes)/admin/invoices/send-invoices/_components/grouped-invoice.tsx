"use client";

import Spinner from "@/components/animations/spinner";
import type { SendInvoiceReturnType } from "@/components/pdf/server-actions/create-and-send-invoice";
import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/user";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IconButton, LoadingButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useServerAction from "@/hooks/use-server-action";
import { streamKy } from "@/lib/custom-ky";
import { dateFormatter } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import type { HTTPError } from "ky";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import createGroupedMonthlyInvoice from "../../_actions/send-grouped-monthly-invoice";
import type { UserWithOrdersForInvoices } from "../../_functions/get-users-with-orders";

function previousMonthOrders(order: { dateOfShipping: Date | null }) {
  const currentDate = new Date();
  const orderDate = order.dateOfShipping ? new Date(order.dateOfShipping) : new Date();
  return orderDate.getTime() < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
}
type OrderIdsRecord = Record<string, string[]>;
function resetOrderIdsRecord(record: OrderIdsRecord) {
  return Object.keys(record).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {} as OrderIdsRecord);
}

const createOrderIdsRecord = (userWithOrdersForInvoices: UserWithOrdersForInvoices) =>
  userWithOrdersForInvoices.reduce((acc, user) => {
    acc[user.id] = user.orders
      .filter((order) => {
        return previousMonthOrders(order);
      })
      .map((order) => order.id);
    return acc;
  }, {} as OrderIdsRecord);

type InvoiceLoadingType = Record<string, { state: "loading" | "success" | "error"; name: string }>;

function GroupedInvoice({ userWithOrdersForInvoices }: { userWithOrdersForInvoices: UserWithOrdersForInvoices }) {
  const { serverAction: createInvoicesAction } = useServerAction(createGroupedMonthlyInvoice);
  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState<InvoiceLoadingType>({});
  const [displayInvoices, setDisplayInvoices] = useState(false);
  const router = useRouter();
  const [orderIdsRecord, setOrderIdsRecord] = useState(createOrderIdsRecord(userWithOrdersForInvoices));
  const orderIdsArray = Object.values(orderIdsRecord).filter((orderIds) => orderIds.length > 0);

  async function sendInvoices(sendEmail: boolean) {
    setLoading(true);
    // const invoiceArray = [
    //   "FA_2024_0065",
    //   "FA_2024_0064",
    //   "FA_2024_0063",
    //   "FA_2024_0062",
    //   "FA_2024_0061",
    //   "FA_2024_0060",
    //   "FA_2024_0059",
    //   "FA_2024_0058",
    //   "FA_2024_0057",
    //   "FA_2024_0056",
    //   "FA_2024_0055",
    //   "FA_2024_0054",
    //   "FA_2024_0053",
    //   "FA_2024_0052",
    //   "FA_2024_0051",
    // ];

    // const invoiceRecord = invoiceArray.reduce(
    //   (acc, invoiceId) => {
    //     acc[invoiceId] = { state: "loading", name: invoiceId };
    //     return acc;
    //   },
    //   {} as Record<
    //     string,
    //     {
    //       state: "loading" | "success" | "error";
    //       name: string;
    //     }
    //   >,
    // );

    if (orderIdsArray.length === 0) {
      toast.error("Veuillez sélectionner au moins un client");
      setLoading(false);
      return;
    }

    const response = await createInvoicesAction({ data: orderIdsArray });
    if (!response) {
      toast.error("Une erreur est survenue lors de la création des factures, veuillez recharger la page");
      setLoading(false);
      return;
    }
    const invoiceRecord: typeof invoiceLoading = {};
    for (const [index, invoice] of response.entries()) {
      if (!invoice.success) {
        const orderId = orderIdsArray[index][0];
        const user = userWithOrdersForInvoices.find((user) => user.orders.some((order) => order.id === orderId));
        user &&
          toast.error(`Une erreur est survenue lors de la creation de la facture pour le client ${getUserName(user)}`);
      } else {
        invoiceRecord[invoice.data.invoiceId] = { state: "loading", name: invoice.data.name };
      }
    }

    if (!sendEmail) {
      console.log(response);
      setLoading(false);
      router.push("/admin/invoices");
      return;
    }

    router.refresh();
    setOrderIdsRecord((prev) => resetOrderIdsRecord(prev));
    setInvoiceLoading(invoiceRecord);
    setDisplayInvoices(true);
    toast.success("Envoi des factures en cours...", {
      position: "bottom-center",
    });

    const chunkSize = 5;
    let cumulativeCount = 0;
    const recordLength = Object.keys(invoiceRecord).length;
    for (let i = 0; i < recordLength; i += chunkSize) {
      const chunk = Object.keys(invoiceRecord).slice(i, i + chunkSize);
      async function onError(error: unknown) {
        setInvoiceLoading((prev) => {
          const updatedInvoices = chunk.reduce(
            (acc, invoiceId) => {
              if (prev[invoiceId].state === "loading") {
                acc[invoiceId] = { state: "error", name: prev[invoiceId].name };
              }
              return acc;
            },
            {} as typeof invoiceLoading,
          );
          return { ...prev, ...updatedInvoices };
        });
        const kyError = error as HTTPError;
        if (kyError.response) {
          const errorData = await kyError.response.text();
          console.error(errorData);
          toast.error(errorData, { duration: 10000 });
        } else {
          console.error(error);
          toast.error("Une erreur est survenue lors de l'envoi des factures, veuillez recharger la page");
        }
      }
      function updateData(result: SendInvoiceReturnType) {
        if (!result.success) {
          toast.error(result.message, {
            position: "top-center",
            duration: 5000,
          });
          if (result.errorData) {
            const invoiceId = result.errorData.invoiceId;
            setInvoiceLoading((prev) => ({
              ...prev,
              [invoiceId]: { state: "error", name: prev[invoiceId].name },
            }));
          }
        } else {
          if (result.data) {
            const invoiceId = result.data.invoiceId;
            setInvoiceLoading((prev) => ({
              ...prev,
              [invoiceId]: { state: "success", name: prev[invoiceId].name },
            }));
          }
        }
      }
      await streamKy("/api/send-invoices", updateData, onError, {
        method: "POST",
        json: { invoiceIds: chunk },
        timeout: 20000,
      });

      cumulativeCount += chunk.length;
      const currentCount = cumulativeCount;
      toast.success(`Facture envoyée : ${currentCount} sur ${recordLength}`, {
        position: "bottom-center",
      });
    }
    setLoading(false);
  }

  return (
    <>
      {displayInvoices && (
        <div className="fixed top-4 left-4 max-w-sm w-full p-4 bg-background rounded-lg shadow-md z-50 space-y-3 overflow-auto max-h-[70vh]">
          {Object.values(invoiceLoading).map((object) => (
            <div
              key={object.name}
              className="flex items-center justify-between border rounded-lg p-3 shadow-sm transition-all duration-300 ease-in-out bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-800">{object.name}</div>
              </div>
              <div>
                {object.state === "loading" && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Spinner className="size-6 animate-spin" />
                    <span className="text-sm">En cours...</span>
                  </div>
                )}
                {object.state === "success" && (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="size-6" />
                    <span className="text-sm">Terminé</span>
                  </div>
                )}
                {object.state === "error" && (
                  <div className="flex items-center gap-2 text-red-500">
                    <X className="size-6" />
                    <span className="text-sm">Erreur</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <IconButton
            Icon={X}
            iconClassName="size-4"
            onClick={() => setDisplayInvoices(false)}
            className="absolute -top-1 right-0  p-1 bg-red-500 text-white rounded-full"
          />
        </div>
      )}
      <Accordion type="multiple" className="relative  flex w-full sm:max-w-xl max-w-[90vw] mx-auto flex-col gap-4 px-4">
        {userWithOrdersForInvoices.map((user, index) => {
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
            <AccordionItem key={index} value={name} className="relative cursor-pointer w-full">
              <label
                htmlFor={name}
                className="absolute -left-4 top-7 -translate-y-1/2 size-10  flex items-center justify-center"
              >
                <Checkbox
                  id={name}
                  checked={ordersId?.length > 0}
                  onCheckedChange={(check) =>
                    setOrderIdsRecord((prev) =>
                      check
                        ? {
                            ...prev,
                            [user.id]: user.orders.some((order) => previousMonthOrders(order))
                              ? user.orders.filter((order) => previousMonthOrders(order)).map((order) => order.id)
                              : user.orders.map((order) => order.id),
                          }
                        : { ...prev, [user.id]: [] },
                    )
                  }
                />{" "}
              </label>

              <AccordionTrigger className="ml-8 lining-nums w-full  gap-2 justify-center items-center relative">
                <NameWithImage displayName={false} name={name} image={user.image} imageSize={12} className="w-fit" />
                <p className="text-gray-500 flex gap-2  w-full  col-span-6">
                  <span>{ordersId?.length}</span>
                  <span>{ordersId?.length > 1 ? " commandes " : " commande "} </span>
                  <span>({currencyFormatter.format(totalPrice)})</span>
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4  py-2 text-sm  ">
                  <h4 className="text-sm font-medium text-gray-500">{name}</h4>
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
          // onClick={() => sendInvoices(true)}
          onClick={() => sendInvoices(true)}
        >
          Créer et envoyer les factures
        </LoadingButton>
      </div>
    </>
  );
}

export default GroupedInvoice;
