"use client";

import { addDelay } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { Button } from "./button";
import type { ReturnTypeServerAction, ReturnTypeServerAction2 } from "@/lib/server-action";
import { useState } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme === "light" ? "light" : "dark"}
      className="toaster group"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

type ToastPromiseProps<T, R, E> = {
  serverAction: (data: T) => Promise<ReturnTypeServerAction<R, E>>;
  data: T;
  errorMessage?: string;
  successMessage?: string;
  message?: string;
  onFinally?: () => void;
  onError?: () => void;
  onSuccess?: (result?: R) => void;
};

const toastPromise = <T, R, E>({
  serverAction,
  data,
  errorMessage = "Envoie du message annulé",
  message = "Envoie du message",
  successMessage = "Message envoyé",
  onFinally,
  onError,
  onSuccess,
}: ToastPromiseProps<T, R, E>) => {
  const abortController = new AbortController();
  const { signal } = abortController;
  const promise = async () => {
    await addDelay(2100, signal).catch((e) => {
      const error = e as Error;
      if (error?.name === "AbortError") {
        throw new Error(errorMessage);
      }
      throw e;
    });

    const result = await serverAction(data).catch((e) => {
      throw new Error(errorMessage);
    });
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.data;
  };

  toast.promise(promise, {
    position: "top-center",
    loading: (
      <div className="flex w-full items-center justify-between">
        <span className="align-middle">
          <Loader2 className="my-auto mr-2 inline size-4 animate-spin" /> {message}{" "}
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
    success: (result) => {
      onSuccess?.(result);
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

type UseToastPromiseProps<T, R, E> = {
  serverAction: (data: T) => Promise<ReturnTypeServerAction2<R, E>>;
  errorMessage?: string;
  message?: string;
};

const useToastPromise = <T, R, E>({
  serverAction,
  errorMessage = "Envoie du message annulé",
  message = "Envoie du message",
}: UseToastPromiseProps<T, R, E>) => {
  const [loading, setLoading] = useState(false);

  function toastServerAction({
    data,
    onFinally,
    onError,
    onSuccess,
  }: { data: T; onFinally?: () => void; onError?: (error?: E) => void; onSuccess?: (result?: R) => void }) {
    setLoading(true);
    const abortController = new AbortController();
    const { signal } = abortController;
    const promise = async () => {
      await addDelay(2100, signal).catch(async (e) => {
        const error = e as Error;
        if (error?.name === "AbortError") {
          await onError?.();
          throw new Error(errorMessage);
        }
        throw e;
      });

      const result = await serverAction(data).catch((e) => {
        throw new Error(errorMessage);
      });

      if (!result.success) {
        await onError?.(result.errorData);
        throw new Error(result.message);
      }
      return result;
    };

    toast.promise(promise, {
      position: "top-center",
      loading: (
        <div className="flex w-full items-center justify-between">
          <span className="align-middle">
            <Loader2 className="my-auto mr-2 inline size-4 animate-spin" /> {message}{" "}
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
      success: async (result) => {
        await onSuccess?.(result.data);
        return result.message;
      },
      error: (e) => {
        const error = e as Error;
        return error?.message || "Erreur";
      },
      finally: async () => {
        await onFinally?.();
        setLoading(false);
      },
    });
  }

  return { loading, setLoading, toastServerAction };
};
export { Toaster, toastPromise, useToastPromise };
