import ButtonBackward from "@/components/ui/button-backward";
import { headers } from "next/headers";
import { OrderForm } from "./_components/order-form";
import getShippingOrder from "./_functions.ts/get-order";
import getProductsForOrders from "./_functions.ts/get-products-for-orders";
import getShopsForOrders from "./_functions.ts/get-shops-for-orders";
import getUsersForOrders from "./_functions.ts/get-users-for-orders";

export const dynamic = "force-dynamic";
const OrderFormPage = async ({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { id: string | undefined; referer: string | undefined; dateOfShipping: string | undefined };
}) => {
  const headersList = headers();
  const headerReferer = headersList.get("referer");
  const referer =
    !headerReferer || headerReferer.includes("/admin/orders/")
      ? decodeURIComponent(searchParams.referer || "/admin/orders")
      : headerReferer;
  const dateOfShipping = searchParams.dateOfShipping ? new Date(searchParams.dateOfShipping) : undefined;
  const orderId = params.orderId === "new" ? decodeURIComponent(searchParams.id || "new") : params.orderId;

  const [products, shops, users, initialData] = await Promise.all([
    getProductsForOrders(),
    getShopsForOrders(),
    getUsersForOrders(),
    getShippingOrder(orderId, dateOfShipping, params.orderId === "new"),
  ]);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <OrderForm products={products} initialData={initialData} users={users} shops={shops} referer={referer} />
        {/* <OrderClient params={params} searchParams={searchParams} /> */}
        <ButtonBackward url={referer} className="block" />
      </div>
    </div>
  );
};

export default OrderFormPage;
