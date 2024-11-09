import OrderFormPage from "@/app/(routes)/admin/orders/[orderId]/page";
import OrderSheet from "./components/order-sheet";

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
    <OrderSheet orderId={params.orderId}>
      <OrderFormPage params={params} searchParams={searchParams} />
    </OrderSheet>
  );
}

export default IntercepteOrderPage;
