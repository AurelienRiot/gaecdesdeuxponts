"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal-form";
import useServerAction from "@/hooks/use-server-action";
import deleteMainProduct from "../_actions/delete-product";

interface CellActionProps {
  data: ProductColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { serverAction, loading } = useServerAction(deleteMainProduct);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Id du produit copié");
  };

  const onDelete = async () => {
    await serverAction({ data: { id: data.id }, onSuccess: () => router.refresh(), onFinally: () => setOpen(false) });
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 relative w-8">
            <span className="sr-only w-0">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)} className="cursor-copy">
            <Copy className="mr-2 h-4 w-4" />
            Copier Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/admin/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
