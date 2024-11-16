"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

function ModalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        router.back();
      }}
      modal
    >
      <SheetContent className="overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md p-4">{children}</SheetContent>
    </Sheet>
  );
}

export default ModalLayout;
