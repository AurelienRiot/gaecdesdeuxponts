"use client";

import { addDelay } from "@/lib/utils";
import { ReturnTypeServerAction } from "@/types";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === "light" ? "light" : "dark"}
      className="toaster group"
      position="bottom-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

type ToastPromiseProps<T> = {
  serverAction: (data: T) => Promise<ReturnTypeServerAction<null>>;
  data: T;
  errorMessage?: string;
  successMessage?: string;
  message?: string;
  onFinally?: () => void;
  onError?: () => void;
  onSuccess?: () => void;
};

const toastPromise = <T,>({
  serverAction,
  data,
  errorMessage = "Envoie du message annulé",
  message = "Envoie du message",
  successMessage = "Message envoyé",
  onFinally,
  onError,
  onSuccess,
}: ToastPromiseProps<T>) => {
  const abortController = new AbortController();
  const { signal } = abortController;
  const promise = async () => {
    try {
      await addDelay(2100, signal);

      await serverAction(data);
    } catch (e) {
      const error = e as Error;
      if (error?.name === "AbortError") {
        throw new Error(errorMessage);
      }
      throw e;
    }

    return signal;
  };

  toast.promise(promise, {
    position: "top-center",
    loading: (
      <div className="flex w-full items-center justify-between">
        <span className="align-middle">
          <Loader2 className="my-auto mr-2 inline size-4 animate-spin" />{" "}
          {message}{" "}
        </span>
        <Button
          size={"xs"}
          className="animate-[hide-element_2s_forwards] text-xs"
          onClick={() => {
            abortController.abort();
          }}
        >
          Annuler
        </Button>
      </div>
    ),
    success: () => {
      onSuccess?.();
      return successMessage;
    },
    error: (e) => {
      const error = e as Error;
      onError?.();
      return error?.message || "Erreur";
    },
    finally: () => {
      onFinally?.();
    },
  });
};
export { Toaster, toastPromise };
