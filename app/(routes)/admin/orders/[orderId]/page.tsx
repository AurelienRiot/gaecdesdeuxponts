import prismadb from "@/lib/prismadb";
import { OrderForm } from "./_components/order-form";

const ProductPage = async ({ params }: { params: { orderId: string } }) => {
  const shippingOrders = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    select: {
      id: true,
      name: true,
      totalPrice: true,
      dateOfPayment: true,
      dateOfShipping: true,
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
      role: { not: "admin" },
    },
    include: {
      address: true,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      isArchived: false,
      product: {
        isArchived: false,
      },
    },
    include: {
      product: true,
    },
  });

  const shops = await prismadb.shop.findMany({});

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm
          products={products}
          initialData={shippingOrders}
          users={users}
          shops={shops}
        />
      </div>
    </div>
  );
};

export default ProductPage;