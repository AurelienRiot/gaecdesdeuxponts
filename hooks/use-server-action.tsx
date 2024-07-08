import type { ReturnTypeServerAction } from "@/lib/server-action";
import { useState } from "react";
import { toast } from "sonner";

function useServerAction<D, R, E = undefined>(action: (data: D) => Promise<ReturnTypeServerAction<R, E>>) {
  const [loading, setLoading] = useState(false);

  async function serverAction({
    data,
    onSuccess,
    onError,
    onFinally,
  }: { data: D; onFinally?: () => void; onError?: (e?: E | undefined) => void; onSuccess?: (result?: R) => void }) {
    setLoading(true);
    return await action(data)
      .then(async (result) => {
        if (!result.success) {
          await onError?.(result.errorData);
          result.message ? toast.error(result.message) : null;
          return;
        }
        await onSuccess?.(result.data);
        result.message ? toast.success(result.message) : null;
        return result.data;
      })
      .catch(async () => {
        await onError?.();
        toast.error("Une erreur est survenue");
      })
      .finally(async () => {
        await onFinally?.();
        setLoading(false);
      });
  }

  return { serverAction, loading, setLoading };
}

export default useServerAction;
