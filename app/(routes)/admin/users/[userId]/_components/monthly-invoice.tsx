"use client";
import { Icons } from "@/components/icons";
import { DisplayMonthlyInvoice } from "@/components/pdf/pdf-button";
import type { monthlyOrdersType } from "@/components/pdf/pdf-data";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastPromise } from "@/components/ui/sonner";
import { dateFormatter } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { fr } from "date-fns/locale";
import { forwardRef, useState } from "react";
import montlyInvoicePaid from "../_actions/montly-invoice-paid";
import type { DayPickerProps } from "react-day-picker";

const MonthlyInvoice = ({ orders }: { orders: monthlyOrdersType[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const selectedOrders = orders.filter((order) => {
    return order?.month === selectedMonth && order.year === selectedYear;
  });

  const isPaid = selectedOrders.length > 0 && selectedOrders.every((order) => order.isPaid);
  const emailSend = selectedOrders.length > 0 && selectedOrders.every((order) => order.invoiceEmail);

  const years = Array.from(new Set(orders.map((order) => order.year))).sort((a, b) => a - b);
  const months = Array.from(new Set(orders.map((order) => order.month))).sort((a, b) => a - b);

  const initialDate = selectedOrders.length > 0 ? selectedOrders[0].dateOfPayment : new Date();

  return (
    <>
      <div className="justify-left flex flex-wrap items-center gap-4 whitespace-nowrap">
        Facture de
        <Select
          onValueChange={(newValue) => {
            setSelectedMonth(Number(newValue));
          }}
          value={selectedMonth.toString()}
        >
          <SelectTrigger className="w-24">
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
          <SelectTrigger className="w-16">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent side="top">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DisplayMonthlyInvoice orders={selectedOrders} isSend={emailSend} />
      </div>
      <FacturationDate
        isPaid={isPaid}
        initialDate={initialDate}
        orderIds={selectedOrders.map((order) => order.orderId)}
      />
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

function FacturationDate({
  isPaid,
  orderIds,
  initialDate,
}: { isPaid: boolean; orderIds: string[]; initialDate: Date | null }) {
  const { loading, toastServerAction } = useToastPromise({
    serverAction: montlyInvoicePaid,
    message: "Validation de la facture",
    errorMessage: "Validation de la facture annulé",
  });
  const [date, setDate] = useState(initialDate || new Date());
  return (
    <div className="space-y-4">
      <DatePicker date={date} setDate={setDate} />

      <Button
        disabled={loading}
        className={cn("whitespace-nowrap ", isPaid ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600")}
        onClick={async () => {
          await toastServerAction({
            data: { orderIds, isPaid: !isPaid, date },
          });
        }}
      >
        {!isPaid ? " Valider la facture" : "Annuler la facture"}
      </Button>
    </div>
  );
}
type DatePickerProps = Omit<DayPickerProps, "mode" | "required" | "selected" | "onSelected" | "locale"> & {
  date?: Date;
  setDate: (date: Date) => void;
};

const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  ({ className, date, setDate, ...props }: DatePickerProps, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <div className={cn("relative flex flex-wrap items-center  gap-2", className)}>
        <div className="text-base  text-secondary-foreground">Date de facturation</div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant={"outline"}
              className={cn("w-fit pl-3 text-left font-normal", !date && "text-muted-foreground")}
            >
              {date ? dateFormatter(date, { days: true }) : <span>Choisir une date</span>}

              <Icons.coloredCalendar
                className="ml-4 h-4 w-4 opacity-100 data-[state=false]:opacity-50"
                data-state={!!date}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="absolute w-auto p-0">
            <Calendar
              mode="single"
              required
              className="p-3"
              selected={date}
              onSelect={setDate}
              locale={fr}
              {...props}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
