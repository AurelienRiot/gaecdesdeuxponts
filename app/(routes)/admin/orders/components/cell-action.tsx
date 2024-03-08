"use client";

import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { useRouter } from "next/navigation";
import { deleteOrders } from "./server-action";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setLoading(true);
    const deleteCat = await deleteOrders({ id: data.id });
    if (!deleteCat.success) {
      toast.error(deleteCat.message);
    } else {
      router.refresh();
      toast.success("Commande supprimée");
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Button
        disabled={loading}
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
