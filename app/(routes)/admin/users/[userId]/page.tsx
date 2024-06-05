import {
  createDataInvoice,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import ButtonBackward from "@/components/ui/button-backward";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import MonthlyInvoice from "./_components/monthly-invoice";
import { OrderColumn } from "./_components/order-column";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";

export const dynamic = "force-dynamic";

const UserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await prismadb.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      address: true,
      billingAddress: true,
      orders: {
        orderBy: {
          createdAt: "asc",
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

  const formatedUser = {
    ...user,
    orders: [],
  };

  const formattedOrders: OrderColumn[] = (user?.orders || []).map((order) => ({
    id: order.id,
    products: createProduct(order),
    productsList: createProductList(order),
    datePickUp: order.datePickUp,
    status: createStatus(order),
    isPaid: !!order.dateOfPayment,
    totalPrice: currencyFormatter.format(order.totalPrice),
    createdAt: order.createdAt,
    shopName: order.shop?.name || "Livraison à domicile",
    shopId: order.shop?.id || "",
    dataInvoice: createDataInvoice({ user, order }),
  }));

  return (
    <div className=" space-y-6 p-8 pt-6 ">
      <div className="mb-8 flex-1 space-y-4 ">
        <UserForm initialData={formatedUser} />
      </div>
      {user.role === "pro" && <MonthlyInvoice user={user} />}
      <div>
        <OrderTable data={formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;
