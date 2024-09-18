"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function UpdatePage({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button variant="default" className={className} onClick={() => router.refresh()}>
      Actualiser
    </Button>
  );
}

export default UpdatePage;
