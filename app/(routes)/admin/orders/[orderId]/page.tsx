import prismadb from "@/lib/prismadb";
import { OrderForm } from "./_components/order-form";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const ProductPage = async ({
  params,
  searchParams,
}: { params: { orderId: string }; searchParams: { orderId: string | undefined } }) => {
  const headersList = headers();
  const referer = headersList.get("referer") || "/admin/orders";

  const orderId = params.orderId === "new" ? decodeURIComponent(searchParams.orderId || "new") : params.orderId;
  console.log(orderId);
  const shippingOrders = await prismadb.order.findUnique({
    where: {
      id: orderId,
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
    include: {
      product: true,
    },
  });

  const shops = await prismadb.shop.findMany({});

  const initialData = !shippingOrders
    ? null
    : params.orderId === "new"
      ? { ...shippingOrders, id: null }
      : shippingOrders;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm products={products} initialData={initialData} users={users} shops={shops} referer={referer} />
      </div>
    </div>
  );
};

export default ProductPage;
