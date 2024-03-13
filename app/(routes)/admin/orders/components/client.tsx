"use client";

import { LoadingButton } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  OrderColumn,
  columns,
  filterableColumns,
  searchableColumns,
  viewOptionsColumns,
} from "./columns";
import { getOrders } from "./server-action";

interface OrderClientProps {
  initialData: OrderColumn[];
  initialDateRange: DateRange;
}

export const OrderClient: React.FC<OrderClientProps> = ({
  initialData,
  initialDateRange,
}) => {
  const [data, setData] = useState<OrderColumn[]>(initialData);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialDateRange,
  );
  const [loading, setLoading] = useState(false);

  const handleChangeDate = async () => {
    setLoading(true);
    const result = await getOrders(dateRange);
    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }
    setData(result.data);
    setLoading(false);
  };

  return (
    <>
      <Heading
        title={`Commandes (${data.length})`}
        description="Gérer les commandes"
      />

      <Separator className="mb-4" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <LoadingButton
          className="w-fit"
          disabled={loading}
          onClick={() => handleChangeDate()}
        >
          Valider
        </LoadingButton>
      </div>
      <DataTable
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        viewOptionsColumns={viewOptionsColumns}
        columns={columns}
        data={data}
      />
    </>
  );
};
