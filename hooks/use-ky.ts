"use client";
import customKy from "@/lib/custom-ky";
import type { Options } from "ky";
import { useCallback, useState } from "react";
import { toast, type ExternalToast } from "sonner";
import type { ZodSchema } from "zod";

function useKy<D>(url: string, method: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`, schema: ZodSchema<D>) {
  const [loading, setLoading] = useState(false);
  const ky = useCallback(
    async ({
      data,
      toastOptions = { position: "top-center" },
      options,
      onSuccess,
      onError,
      onFinally,
    }: {
      data: any;
      onFinally?: () => void;
      onError?: () => void;
      onSuccess?: (result: D) => void;
      toastOptions?: ExternalToast;
      options?: Omit<Options, "method">;
    }) => {
      setLoading(true);

      return await customKy(url, method, schema, { json: data, ...options })
        .then(async (result) => {
          await onSuccess?.(result);
        })
        .catch(async (error) => {
          await onError?.();
          toast.error(error.message, toastOptions);
        })
        .finally(async () => {
          await onFinally?.();
          setLoading(false);
        });
    },
    [method, url, schema],
  );

  return { ky, loading };
}
export default useKy;
