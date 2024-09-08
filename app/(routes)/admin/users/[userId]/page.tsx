import type { monthlyOrdersType } from "@/components/pdf/pdf-data";
import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import ButtonBackward from "@/components/ui/button-backward";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import MonthlyInvoice from "./_components/monthly-invoice";
import type { OrderColumn } from "./_components/order-column";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";
import { CreateUserForm } from "./_components/create-user-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

const UserPage = async ({
  params,
  searchParams,
}: {
  params: { userId: string | "new" | undefined };
  searchParams: { incomplete: string | undefined };
}) => {
  if (params.userId === "new") {
    return <CreateUserForm />;
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      address: true,
      billingAddress: true,
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          orderItems: true,
          shop: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }

  const montlyOrders: (monthlyOrdersType | null)[] = user.orders.map((order) => {
    if (!order.dateOfShipping) return null;
    return {
      orderId: order.id,
      month: order.dateOfShipping.getMonth() + 1,
      year: order.dateOfShipping.getFullYear(),
      invoiceEmail: order.invoiceEmail,
      isPaid: !!order.dateOfPayment,
      dateOfPayment: order.dateOfPayment,
    };
  });

  const formatedUser = {
    ...user,
    orders: [],
  };

  const formattedOrders: OrderColumn[] = (user?.orders || []).map((order) => ({
    id: order.id,
    shippingEmail: order.shippingEmail,
    invoiceEmail: order.invoiceEmail,
    products: createProduct(order.orderItems),
    productsList: createProductList(order.orderItems),
    datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
    status: createStatus(order),
    isPaid: !!order.dateOfPayment,
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
  }));

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4">
        <UserForm initialData={formatedUser} incomplete={!!searchParams.incomplete} />
      </div>
      <div>
        <Heading title={`Facture mensuelle`} description="" />
        <Separator className="my-4" />
        {user.role === "pro" && (
          <MonthlyInvoice orders={montlyOrders.filter((order) => !!order) as monthlyOrdersType[]} />
        )}
      </div>
      <div>
        <OrderTable data={formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;
