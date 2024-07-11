"use client";
import { DisplayMonthlyInvoice } from "@/components/pdf/pdf-button";
import type { monthlyOrdersType } from "@/components/pdf/pdf-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastPromise } from "@/components/ui/sonner";
import { useState } from "react";
import montlyInvoicePaid from "../_actions/montly-invoice-paid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MonthlyInvoice = ({ orders }: { orders: monthlyOrdersType[] }) => {
  const { loading, toastServerAction } = useToastPromise({
    serverAction: montlyInvoicePaid,
    message: "Validation de la facture",
    errorMessage: "Validation de la facture annulé",
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const selectedOrders = orders.filter((order) => {
    return order?.month === selectedMonth && order.year === selectedYear;
  });

  const isPaid = selectedOrders.every((order) => order.isPaid);
  const emailSend = selectedOrders.every((order) => order.invoiceEmail);

  const years = Array.from(new Set(orders.map((order) => order.year))).sort((a, b) => a - b);
  const months = Array.from(new Set(orders.map((order) => order.month))).sort((a, b) => a - b);

  return (
    <>
      <div className="justify-left flex items-center gap-4">
        Facture de
        <Select
          onValueChange={(newValue) => {
            setSelectedMonth(Number(newValue));
          }}
          value={selectedMonth.toString()}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Mois" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month.toString()}>
                {new Date(2022, month - 1, 1).toLocaleString("fr", {
                  month: "long",
                })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(newValue) => {
            setSelectedYear(Number(newValue));
          }}
          value={selectedYear.toString()}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DisplayMonthlyInvoice orders={selectedOrders} />
        <Button
          disabled={loading}
          className={cn(isPaid ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
          onClick={async () => {
            await toastServerAction({
              data: { orderIds: selectedOrders.map((order) => order.orderId), isPaid: !isPaid },
            });
          }}
        >
          {!isPaid ? " Valider la facture" : "Annuler la facture"}
        </Button>
      </div>
      {emailSend ? (
        <p className="text-sm font-normal text-green-500">La facture a été envoyée</p>
      ) : (
        <p className="text-sm font-normal text-red-500">La facture n'a pas été envoyée</p>
      )}
      {isPaid ? (
        <p className="text-sm font-normal text-green-500">La facture est payée</p>
      ) : (
        <p className="text-sm font-normal text-red-500">La facture n'est pas payée</p>
      )}
    </>
  );
};

export default MonthlyInvoice;
