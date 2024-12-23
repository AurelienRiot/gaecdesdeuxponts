"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function SheetLayoutProvider({
  children,
  title,
  description,
  side = "right",
}: { children: React.ReactNode; title: string; description?: string; side?: "right" | "bottom" }) {
  const router = useRouter();
  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        router.back();
      }}
      modal
    >
      <SheetContent
        side={side}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          side === "right"
            ? "overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md p-4"
            : "overflow-y-scroll w-full h-[90%]",
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default SheetLayoutProvider;
