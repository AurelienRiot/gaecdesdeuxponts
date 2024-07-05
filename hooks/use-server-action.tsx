import type { ReturnTypeServerAction2 } from "@/lib/server-action";
import { useState } from "react";
import { toast } from "sonner";

function useSeverAction<D, R, E = undefined>(action: (data: D) => Promise<ReturnTypeServerAction2<R, E>>) {
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
          result.message ? toast.error(result.message) : null;
          await onError?.(result.errorData);
          return;
        }
        result.message ? toast.success(result.message) : null;
        await onSuccess?.(result.data);
      })
      .catch(async (e) => {
        await onError?.();
        toast.error(e.message);
      })
      .finally(async () => {
        setLoading(false);
        await onFinally?.();
      });
  }

  return { serverAction, loading, setLoading };
}

export default useSeverAction;
