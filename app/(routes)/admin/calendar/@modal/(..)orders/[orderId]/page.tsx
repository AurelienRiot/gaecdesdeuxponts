import { OrderForm } from "@/app/(routes)/admin/orders/[orderId]/_components/order-form";
import getShippingOrder from "@/app/(routes)/admin/orders/[orderId]/_functions/get-order";
import getProductsForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-products-for-orders";
import getShopsForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-shops-for-orders";
import getUsersForOrders from "@/app/(routes)/admin/orders/[orderId]/_functions/get-users-for-orders";
import { headers } from "next/headers";
import { Suspense } from "react";
import Loading from "../../_loading";
import OrderSheet from "./components/order-sheet";
import { getUnitLabel } from "@/components/product/product-function";

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
  const headersList = headers();
  const headerReferer = headersList.get("referer");
  const referer =
    !headerReferer || headerReferer.includes("/admin/orders/")
      ? decodeURIComponent(searchParams.referer || "/admin/calendar")
      : headerReferer;
  const dateOfShipping = searchParams.dateOfShipping ? new Date(searchParams.dateOfShipping) : undefined;
  return (
    <OrderSheet orderId={params.orderId}>
      <Suspense fallback={<Loading />}>
        <DisplayOrderForm
          orderId={params.orderId}
          referer={referer}
          newOrderId={searchParams.newOrderId}
          userId={searchParams.userId}
          dateOfShipping={dateOfShipping}
        />
      </Suspense>
    </OrderSheet>
  );
}

export default IntercepteOrderPage;

async function DisplayOrderForm({
  orderId,
  newOrderId,
  referer,
  dateOfShipping,
  userId,
}: { orderId: string; newOrderId: string; dateOfShipping?: Date; referer: string; userId: string | undefined }) {
  const [products, shops, users, initialData] = await Promise.all([
    getProductsForOrders(),
    getShopsForOrders(),
    getUsersForOrders(),
    getShippingOrder({ orderId, dateOfShipping, userId, newOrderId }),
  ]);

  if (initialData && orderId === "new") {
    for (const item of initialData.orderItems) {
      const product = products.find((product) => product.id === item.itemId);
      if (product) {
        item.name = product.name;
        item.description = product.description;
        item.categoryName = product.product.categoryName;
        item.stocks = product.stocks.map((stock) => stock.stockId);
        item.tax = product.tax;
        item.unit = getUnitLabel(product.unit).quantity;
      }
    }
  }

  return <OrderForm products={products} initialData={initialData} users={users} shops={shops} referer={referer} />;
}
