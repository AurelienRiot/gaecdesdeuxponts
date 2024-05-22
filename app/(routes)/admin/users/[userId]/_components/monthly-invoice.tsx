"use client";
import { DisplayMonthlyInvoice } from "@/components/pdf/pdf-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserWithOrdersAndAdress } from "@/types";
import { useState } from "react";

const MonthlyInvoice = ({ user }: { user: UserWithOrdersAndAdress }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  const years = Array.from(
    new Set(
      user.orders.map((order) =>
        new Date(order.dateOfShipping || new Date()).getFullYear(),
      ),
    ),
  );
  const months = Array.from(
    new Set(
      user.orders.map(
        (order) => new Date(order.dateOfShipping || new Date()).getMonth() + 1,
      ),
    ),
  );

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
      <DisplayMonthlyInvoice
        user={user}
        month={selectedMonth}
        year={selectedYear}
      />
    </div>
  );
};

export default MonthlyInvoice;
