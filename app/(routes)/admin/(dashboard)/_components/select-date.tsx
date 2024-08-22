"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SelectDate = ({ month, year }: { month: number; year: number }) => {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const router = useRouter();

  function onSumit() {
    router.push(`?month=${selectedMonth}&year=${selectedYear}`);
  }

  return (
    <div className="justify-left flex flex-wrap items-center gap-4 whitespace-nowrap">
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
          {Array.from({ length: 12 }, (_, index) => index).map((month) => (
            <SelectItem key={month} value={month.toString()}>
              {new Date(2024, month, 1).toLocaleString("fr", {
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
          {Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, index) => 2024 + index).map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" onClick={onSumit}>
        Validé
      </Button>
    </div>
  );
};

export default SelectDate;
