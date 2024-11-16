"use client";
import useServerAction from "@/hooks/use-server-action";
import { TrashButton } from "./animations/lottie-animation/trash-button";
import { AlertModal } from "./ui/alert-modal-form";
import { useState } from "react";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { cn } from "@/lib/utils";

type DeleteButtonProps<D, R, E = undefined> = {
  data: D;
  action: (data: D) => Promise<ReturnTypeServerAction<R, E>>;
  isSubmitting?: boolean;
  onBeforeDelete?: () => void;
  onSuccess?: (data?: R) => void;
  onError?: (error?: E) => void;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  title?: string;
  description?: string;
};

function DeleteButton<D, R, E = undefined>({
  data,
  isSubmitting,
  action,
  onSuccess,
  onError,
  onBeforeDelete,
  children,
  className,
  iconClassName,
  title,
  description,
}: DeleteButtonProps<D, R, E>) {
  const [open, setOpen] = useState(false);
  const { serverAction, loading } = useServerAction(action);

  const onDelete = async () => {
    onBeforeDelete?.();
    await serverAction({ data, onSuccess, onError, onFinally: () => setOpen(false) });
  };
  return (
    <>
      <AlertModal
        title={title}
        description={description}
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />

      <TrashButton
        disabled={isSubmitting || loading}
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        iconClassName={cn("size-6", iconClassName)}
        className={className}
      >
        {children}
      </TrashButton>
    </>
  );
}

export default DeleteButton;
