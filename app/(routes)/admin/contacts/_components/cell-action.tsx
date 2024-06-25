"use client";

import type { ContactColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { deleteContact } from "./server-action";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";

interface CellActionProps {
  data: ContactColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    const deleteCat = await deleteContact({ id: data.id });
    if (!deleteCat.success) {
      toast.error(deleteCat.message);
    } else {
      router.refresh();
      toast.success("Contact supprimé");
    }
    setOpen(false);
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />

      <TrashButton variant="destructive" size="sm" onClick={() => setOpen(true)} iconClassName="size-6" />
    </>
  );
};
