"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

function SheetLayoutProvider({
  children,
  title,
  description,
}: { children: React.ReactNode; title: string; description?: string }) {
  const router = useRouter();
  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        router.back();
      }}
      modal
    >
      <SheetContent className="overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md p-4">
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
