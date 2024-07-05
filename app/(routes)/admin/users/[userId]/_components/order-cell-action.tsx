"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrderColumn } from "./order-column";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { deleteOrder } from "@/components/table-custom-fuction/orders-server-actions";
import useSeverAction from "@/hooks/use-server-action";

interface OrderCellActionProps {
  data: OrderColumn;
}

export const OrderCellAction: React.FC<OrderCellActionProps> = ({ data }) => {
  const router = useRouter();
  const { serverAction, loading } = useSeverAction(deleteOrder);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order Id copied to the clipboard");
  };

  const onDelete = async () => {
    function onSuccess() {
      router.refresh();
    }
    await serverAction({ data: { id: data.id }, onSuccess, onFinally: () => setOpen(false) });
  };
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only w-0">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-copy">
            <Copy className="mr-2 h-4 w-4" />
            Copier Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/admin/orders/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Éditer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)} disabled={loading}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
