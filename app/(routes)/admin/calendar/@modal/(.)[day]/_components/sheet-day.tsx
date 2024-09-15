"use client";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { dateFormatter } from "@/lib/date-utils";
import { useRouter } from "next/navigation";

function SheetDay({ date, children }: { date?: Date; children: React.ReactNode }) {
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
        aria-describedby={`Résumer des commandes`}
        className="overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md space-y-2"
      >
        <SheetHeader>
          <SheetTitle className="flex flex-col gap-1 items-center justify-center text-2xl lining-nums">
            <span>Commande pour le</span>
            {date ? (
              <span>{dateFormatter(date, { customFormat: "EEEE d MMMM" })}</span>
            ) : (
              <Skeleton className="inline ml-4 " variant={"default"} size={"lg"} />
            )}
          </SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default SheetDay;
