"use client";
import { DisplayMonthlyInvoice } from "@/components/pdf/pdf-button";
import { monthlyOrdersType } from "@/components/pdf/pdf-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const MonthlyInvoice = ({ orders }: { orders: monthlyOrdersType[] }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const selectedOrders = orders.filter((order) => {
    return order?.month === selectedMonth && order.year === selectedYear;
  });

  const years = Array.from(new Set(orders.map((order) => order.year)));
  const months = Array.from(new Set(orders.map((order) => order.month)));

  return (
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
              {new Date(2022, month - 1, 1).toLocaleString("default", {
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
    </div>
  );
};

export default MonthlyInvoice;
