"use client";

import { LoadingButton } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

function UpdatePage({ className }: { className?: string }) {
  const queryClient = useQueryClient();
  return (
    <LoadingButton
      variant="default"
      className={className}
      onClick={() => {
        queryClient.invalidateQueries({ queryKey: ["fetchOrders"] });
        // router.push(`?refresh=${nanoid(5)}`);
      }}
    >
      Actualiser
    </LoadingButton>
  );
}

export default UpdatePage;
