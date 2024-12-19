import ButtonBackward from "@/components/ui/button-backward";
import { OrderForm } from "./_components/order-form";
import getShippingOrder, { updateProductsForOrder } from "./_functions/get-order";
import getProductsForOrders from "./_functions/get-products-for-orders";
import getShopsForOrders from "./_functions/get-shops-for-orders";
import getUsersForOrders from "./_functions/get-users-for-orders";

export const dynamic = "force-dynamic";
const OrderFormPage = async (
  props: {
    params: Promise<{ orderId: string }>;
    searchParams: Promise<{
      newOrderId: string | undefined;
      userId: string | undefined;
      dateOfShipping: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const dateOfShipping = searchParams.dateOfShipping ? new Date(searchParams.dateOfShipping) : undefined;

  const [products, shops, users, initialData] = await Promise.all([
    getProductsForOrders(),
    getShopsForOrders(),
    getUsersForOrders(),
    getShippingOrder({
      orderId: params.orderId,
      dateOfShipping,
      userId: searchParams.userId,
      newOrderId: searchParams.newOrderId,
    }),
  ]);
  const order = initialData && params.orderId === "new" ? updateProductsForOrder(initialData, products) : initialData;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <OrderForm products={products} initialData={order} users={users} shops={shops} />
        <ButtonBackward className="block" />
      </div>
    </div>
  );
};

export default OrderFormPage;
