import prismadb from "@/lib/prismadb";
import { headers } from "next/headers";
import { OrderForm, type ProductFormProps } from "./_components/order-form";
import { priorityMap } from "@/components/product/product-function";

export const dynamic = "force-dynamic";
const OrderFormPage = async ({
  params,
  searchParams,
}: { params: { orderId: string }; searchParams: { id: string | undefined; referer: string | undefined } }) => {
  const headersList = headers();
  const headerReferer = headersList.get("referer");
  const referer =
    !headerReferer || headerReferer.includes("/admin/orders/")
      ? decodeURIComponent(searchParams.referer || "/admin/orders")
      : headerReferer;

  const orderId = params.orderId === "new" ? decodeURIComponent(searchParams.id || "new") : params.orderId;
  const shippingOrders = await prismadb.order.findUnique({
    where: {
      id: orderId,
      deletedAt: null,
    },
    select: {
      id: true,
      totalPrice: true,
      dateOfPayment: true,
      dateOfShipping: true,
      dateOfEdition: true,
      invoiceEmail: true,
      shippingEmail: true,
      orderItems: {
        select: {
          name: true,
          itemId: true,
          unit: true,
          price: true,
          quantity: true,
          categoryName: true,
          description: true,
        },
      },
      userId: true,
      shopId: true,
      datePickUp: true,
    },
  });
  const users = await prismadb.user.findMany({
    where: {
      NOT: {
        role: { in: ["admin", "deleted", "readOnlyAdmin"] },
      },
    },
    include: {
      address: true,
      billingAddress: true,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      product: {
        categoryName: {
          not: "Produits AMAP",
        },
      },
    },
    include: {
      product: true,
    },
  });

  const shops = await prismadb.shop.findMany({});

  const initialData: ProductFormProps["initialData"] = !shippingOrders
    ? null
    : params.orderId === "new"
      ? {
          ...shippingOrders,
          orderItems: shippingOrders.orderItems.filter((item) => item.quantity > 0 && item.price > 0),
          id: null,
        }
      : shippingOrders;

  const sortedProducts = products.sort((a, b) => {
    const aPriority = priorityMap[a.name] || Number.MAX_SAFE_INTEGER;
    const bPriority = priorityMap[b.name] || Number.MAX_SAFE_INTEGER;

    return aPriority - bPriority;
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm products={sortedProducts} initialData={initialData} users={users} shops={shops} referer={referer} />
        {/* <OrderClient params={params} searchParams={searchParams} /> */}
      </div>
    </div>
  );
};

export default OrderFormPage;
