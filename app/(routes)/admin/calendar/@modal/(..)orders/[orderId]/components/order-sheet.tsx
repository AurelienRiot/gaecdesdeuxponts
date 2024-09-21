"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

function OrderSheet({ orderId, children }: { orderId?: string; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        router.back();
        router.refresh();
      }}
      modal
    >
      <SheetContent
        aria-describedby={`Modifier la commande ${orderId}`}
        className="overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md "
      >
        {" "}
        <div className="space-y-6 w-full pb-6">
          <SheetHeader className="sr-only">
            <SheetTitle>
              <span>Commande n°{orderId}</span>
            </SheetTitle>
            <SheetDescription className="">Modifier la commande</SheetDescription>
          </SheetHeader>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderSheet;
