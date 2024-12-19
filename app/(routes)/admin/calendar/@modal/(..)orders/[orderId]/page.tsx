import OrderFormPage from "@/app/(routes)/admin/orders/[orderId]/page";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const dynamic = "force-dynamic";

async function IntercepteOrderPage(props: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{
    newOrderId: string;
    userId: string | undefined;
    referer: string | undefined;
    dateOfShipping: string | undefined;
  }>;
}) {
  const orderId = (await props.params).orderId;
  return (
    <div className="space-y-6 w-full pb-6">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>{orderId === "new" ? "Nouvelle commande" : `Commande n°${orderId}`}</span>
        </SheetTitle>
        <SheetDescription className="">
          {orderId === "new" ? "Créer une nouvelle commande" : "Modifier la commande"}
        </SheetDescription>
      </SheetHeader>
      <OrderFormPage params={props.params} searchParams={props.searchParams} />
    </div>
  );
}

export default IntercepteOrderPage;
