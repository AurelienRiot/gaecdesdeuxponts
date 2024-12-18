"use client";
import TrashButton from "@/components/animations/icons/trash-button";
import { AlertModal } from "@/components/ui/alert-modal-form";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import deleteContact from "../_actions/delete-contact";
import type { ContactColumn } from "./columns";

interface CellActionProps {
  data: ContactColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { serverAction, loading } = useServerAction(deleteContact);

  const onDelete = async () => {
    await serverAction({
      data: { id: data.id },
      onSuccess: () => {
        router.refresh();
      },
      onFinally: () => {
        setOpen(false);
      },
    });
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />

      <TrashButton disabled={loading} onClick={() => setOpen(true)} />
    </>
  );
};
