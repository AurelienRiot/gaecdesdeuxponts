"use client";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

function UpdatePage({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  return (
    <Button
      variant="default"
      className={className}
      onClick={() => {
        queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
        // router.push(`?refresh=${nanoid(5)}`);
      }}
    >
      Actualiser
    </Button>
  );
}

export default UpdatePage;
