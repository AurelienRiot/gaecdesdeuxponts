"use client";

import { LoadingButton } from "@/components/ui/button";
import { nanoid } from "@/lib/id";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function UpdatePage({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh");
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    if (!refresh) return;
    setIsUpdating(false);
  }, [refresh]);
  return (
    <LoadingButton
      variant="default"
      className={className}
      onClick={() => {
        setIsUpdating(true);
        router.push(`?refresh=${nanoid(5)}`);
      }}
      disabled={isUpdating}
    >
      Actualiser
    </LoadingButton>
  );
}

export default UpdatePage;
