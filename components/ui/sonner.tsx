"use client";

import type { ReturnTypeServerAction } from "@/lib/server-action";
import { addDelay } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { Toaster as Sonner, toast } from "sonner";
import { Button } from "./button";

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
      expand
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

type UseToastPromiseProps<D, R, E> = {
  serverAction: (data: D) => Promise<ReturnTypeServerAction<R, E>>;
  errorMessage?: string;
  message?: string;
};

const useToastPromise = <D, R, E = undefined>({
  serverAction,
  errorMessage = "Envoie du message annulé",
  message = "Envoie du message",
}: UseToastPromiseProps<D, R, E>) => {
  const [loading, setLoading] = useState(false);

  const toastServerAction = useCallback(
    async ({
      data,
      onFinally,
      onError,
      onSuccess,
      delay = true,
    }: {
      data: D;
      onFinally?: () => void;
      onError?: (error?: E) => void;
      onSuccess?: (result?: R) => void;
      delay?: boolean;
    }) => {
      setLoading(true);
      const abortController = new AbortController();
      const promise = async () => {
        delay &&
          (await addDelay(2100, abortController.signal).catch(async (e) => {
            const error = e as Error;
            if (error?.name === "AbortError") {
              await onError?.();
              throw new Error(errorMessage);
            }
            throw e;
          }));

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
          <div className="flex w-full items-center justify-between transition-transform">
            <span className="align-middle">
              <Loader2 className="my-auto mr-2 inline size-4 animate-spin" /> {message}{" "}
            </span>
            <Button
              size={"xs"}
              disabled={!delay}
              className="animate-[hide-element_2s_forwards] text-xs "
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
    },
    [serverAction, errorMessage, message],
  );

  return { loading, setLoading, toastServerAction };
};
export { Toaster, useToastPromise };
