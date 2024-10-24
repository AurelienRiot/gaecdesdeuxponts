"use client";

import { Button } from "@/components/ui/button";
import { useOrdersQueryClient } from "./orders-query";

function UpdatePage({ className }: { className?: string }) {
  const { refectOrders } = useOrdersQueryClient();
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
