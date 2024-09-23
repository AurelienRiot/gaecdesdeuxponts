"use client";

import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { AlertModal } from "@/components/ui/alert-modal-form";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import deleteInvoice from "../_actions/delete-invoice";
import type { InvoiceColumn } from "./columns";
import { useConfirm } from "@/components/ui/confirm-dialog";

interface CellActionProps {
  data: InvoiceColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { serverAction, loading } = useServerAction(deleteInvoice);
  const confirm = useConfirm();

  const onDelete = async () => {
    const result = await confirm({
      title: "Confirmation de la suppression de la facture",
      description: "Etes-vous sur de vouloir supprimer cette facture ?",
    });
    if (!result) {
      return;
    }

    await serverAction({
      data: { id: data.id },
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <>
      {/* <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} /> */}

      <TrashButton disabled={loading} variant="destructive" size="sm" onClick={onDelete} iconClassName="size-6" />
    </>
  );
};
