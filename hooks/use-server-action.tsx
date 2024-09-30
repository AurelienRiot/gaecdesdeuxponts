"use client";
import type { ReturnTypeServerAction } from "@/lib/server-action";
import { useCallback, useState } from "react";
import { toast, type ExternalToast } from "sonner";

function useServerAction<D, R, E = undefined>(action: (data: D) => Promise<ReturnTypeServerAction<R, E>>) {
  const [loading, setLoading] = useState(false);
  const serverAction = useCallback(
    async ({
      data,
      toastOptions = { position: "top-center" },
      onSuccess,
      onError,
      onFinally,
    }: {
      data: D;
      onFinally?: () => void;
      onError?: (
        errorData?: E,
        zodError?: {
          [x: string]: string[] | undefined;
          [x: number]: string[] | undefined;
          [x: symbol]: string[] | undefined;
        },
      ) => void;
      onSuccess?: (result?: R) => void;
      toastOptions?: ExternalToast;
    }) => {
      setLoading(true);

      return await action(data)
        .then(async (result) => {
          if (!result.success) {
            await onError?.(result.errorData, result.zodError);
            result.message ? toast.error(result.message, toastOptions) : null;
            return;
          }
          await onSuccess?.(result.data);
          result.message ? toast.success(result.message, toastOptions) : null;
          return result.data;
        })
        .catch(async () => {
          await onError?.();
          toast.error("Une erreur est survenue", toastOptions);
        })
        .finally(async () => {
          await onFinally?.();
          setLoading(false);
        });
    },
    [action],
  );

  return { serverAction, loading, setLoading };
}

export default useServerAction;
