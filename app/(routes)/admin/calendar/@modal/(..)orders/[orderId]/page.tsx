import { OrderForm } from "@/app/(routes)/admin/orders/[orderId]/_components/order-form";
import getShippingOrder from "@/app/(routes)/admin/orders/[orderId]/_functions.ts/get-order";
import getProductsForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions.ts/get-products-for-orders";
import getShopsForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions.ts/get-shops-for-orders";
import getUsersForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions.ts/get-users-for-orders";
import { headers } from "next/headers";
import { Suspense } from "react";
import Loading from "../../_loading";
import OrderSheet from "./components/order-sheet";
import { addDelay } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function IntercepteOrderPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { id: string | undefined; referer: string | undefined; dateOfShipping: string | undefined };
}) {
  const headersList = headers();
  const headerReferer = headersList.get("referer");
  const referer =
    !headerReferer || headerReferer.includes("/admin/orders/")
      ? decodeURIComponent(searchParams.referer || "/admin/calendar")
      : headerReferer;
  const dateOfShipping = searchParams.dateOfShipping ? new Date(searchParams.dateOfShipping) : undefined;
  const orderId = params.orderId === "new" ? decodeURIComponent(searchParams.id || "new") : params.orderId;
  return (
    <OrderSheet orderId={params.orderId}>
      <Suspense fallback={<Loading />}>
        <DisplayOrderForm
          orderId={orderId}
          referer={referer}
          dateOfShipping={dateOfShipping}
          newOrder={params.orderId === "new"}
        />
      </Suspense>
    </OrderSheet>
  );
}

export default IntercepteOrderPage;

async function DisplayOrderForm({
  orderId,
  referer,
  dateOfShipping,
  newOrder,
}: { orderId: string; dateOfShipping?: Date; referer: string; newOrder?: boolean }) {
  const [products, shops, users, initialData] = await Promise.all([
    getProductsForOrders(),
    getShopsForOrders(),
    getUsersForOrders(),
    getShippingOrder(orderId, dateOfShipping, newOrder),
  ]);
  return <OrderForm products={products} initialData={initialData} users={users} shops={shops} referer={referer} />;
}
