"use client";

import { Button } from "@/components/ui/button";
import { useOrdersQueryClient } from "../../../../../hooks/use-query/orders-query";
import { useUsersQueryClient } from "../../../../../hooks/use-query/users-query";

function UpdatePage({ className }: { className?: string }) {
  const { refectOrders } = useOrdersQueryClient();
  const { refectUsers } = useUsersQueryClient();
  return (
    <Button
      variant="default"
      className={className}
      onClick={() => {
        refectOrders();
        refectUsers();
      }}
    >
      Actualiser
    </Button>
  );
}

export default UpdatePage;
