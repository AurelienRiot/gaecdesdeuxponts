import OrderFormPage from "@/app/(routes)/admin/orders/[orderId]/page";

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
  return (
    <div className="space-y-6 w-full pb-6">
      <OrderFormPage params={props.params} searchParams={props.searchParams} />
    </div>
  );
}

export default IntercepteOrderPage;
