import { getUnitLabel } from "@/components/product/product-function";
import ButtonBackward from "@/components/ui/button-backward";
import { OrderForm } from "./_components/order-form";
import getShippingOrder from "./_functions/get-order";
import getProductsForOrders from "./_functions/get-products-for-orders";
import getShopsForOrders from "./_functions/get-shops-for-orders";
import getUsersForOrders from "./_functions/get-users-for-orders";

export const dynamic = "force-dynamic";
const OrderFormPage = async ({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: {
    newOrderId: string | undefined;
    userId: string | undefined;
    dateOfShipping: string | undefined;
  };
}) => {
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
  if (initialData && params.orderId === "new") {
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <OrderForm products={products} initialData={initialData} users={users} shops={shops} />
        <ButtonBackward className="block" />
      </div>
    </div>
  );
};

export default OrderFormPage;
