"use client";
import useServerAction from "@/hooks/use-server-action";
import { TrashButton } from "./animations/lottie-animation/trash-button";
import { AlertModal } from "./ui/alert-modal-form";
import { useState } from "react";
import type { ReturnTypeServerAction2 } from "@/lib/server-action";

type DeleteButtonProps<D, R, E = undefined> = {
  data: D;
  action: (data: D) => Promise<ReturnTypeServerAction2<R, E>>;
  isSubmitting?: boolean;
  onSuccess?: () => void;
  children?: React.ReactNode;
};

function DeleteButton<D, R, E = undefined>({
  data,
  isSubmitting,
  action,
  onSuccess,
  children,
}: DeleteButtonProps<D, R, E>) {
  const [open, setOpen] = useState(false);
  const { serverAction, loading } = useServerAction(action);

  const onDelete = async () => {
    await serverAction({ data, onSuccess, onFinally: () => setOpen(false) });
  };
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />

      <TrashButton
        disabled={isSubmitting || loading}
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        iconClassName="size-6"
      >
        {children}
      </TrashButton>
    </>
  );
}

export default DeleteButton;
