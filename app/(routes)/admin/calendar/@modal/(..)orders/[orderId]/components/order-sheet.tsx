import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function OrderSheet({ orderId, children }: { orderId?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6 w-full pb-6">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>Commande n°{orderId}</span>
        </SheetTitle>
        <SheetDescription className="">Modifier la commande</SheetDescription>
      </SheetHeader>
      {children}
    </div>
  );
}

export default OrderSheet;
