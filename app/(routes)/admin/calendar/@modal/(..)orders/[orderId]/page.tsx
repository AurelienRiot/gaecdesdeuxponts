import OrderFormPage from "@/app/(routes)/admin/orders/[orderId]/page";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const dynamic = "force-dynamic";

async function IntercepteOrderPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: {
    newOrderId: string;
    userId: string | undefined;
    referer: string | undefined;
    dateOfShipping: string | undefined;
  };
}) {
  return (
    <div className="space-y-6 w-full pb-6">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>{params.orderId === "new" ? "Nouvelle commande" : `Commande n°${params.orderId}`}</span>
        </SheetTitle>
        <SheetDescription className="">
          {params.orderId === "new" ? "Créer une nouvelle commande" : "Modifier la commande"}
        </SheetDescription>
      </SheetHeader>
      <OrderFormPage params={params} searchParams={searchParams} />
    </div>
  );
}

export default IntercepteOrderPage;
