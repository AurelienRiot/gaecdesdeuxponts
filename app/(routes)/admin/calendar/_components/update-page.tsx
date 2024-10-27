"use client";

import { Button } from "@/components/ui/button";
import { useOrdersQueryClient } from "./orders-query";
import { previousDay } from "date-fns";
import type { CalendarOrdersType } from "../_functions/get-orders";

function UpdatePage({ className }: { className?: string }) {
  const { refectOrders, mutateUser } = useOrdersQueryClient();
  return (
    <Button
      variant="default"
      className={className}
      onClick={() => {
        refectOrders();

        // router.push(`?refresh=${nanoid(5)}`);
      }}
    >
      Actualiser
    </Button>
  );
}

export default UpdatePage;
