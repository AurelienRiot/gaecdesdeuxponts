"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./order-column";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { deleteOrders } from "../../../orders/components/server-action";

interface OrderCellActionProps {
  data: OrderColumn;
}

export const OrderCellAction: React.FC<OrderCellActionProps> = ({ data }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order Id copied to the clipboard");
  };

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only w-0">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
            className="cursor-copy"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copier Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};