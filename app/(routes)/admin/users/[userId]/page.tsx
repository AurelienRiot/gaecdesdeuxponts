import {
  createDatePickUp,
  createProduct,
  createProductList,
  createStatus,
} from "@/components/table-custom-fuction/cell-orders";
import ButtonBackward from "@/components/ui/button-backward";
import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import { CreateUserForm } from "./_components/create-user-form";
import type { OrderColumn } from "./_components/order-column";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";

export const dynamic = "force-dynamic";

const getUserPageData = unstable_cache(
  async (id: string | undefined) => {
    console.log(id);
    const user = await prismadb.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        billingAddress: true,
        orders: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            orderItems: true,
            shop: true,
            invoiceOrder: {
              select: { invoice: { select: { id: true, invoiceEmail: true, dateOfPayment: true } } },
              orderBy: { createdAt: "desc" },
              where: { invoice: { deletedAt: null } },
            },
          },
        },
      },
    });
    if (!user) return null;

    const formatedUser = {
      ...user,
      orders: [],
    };

    const formattedOrders: OrderColumn[] = (user?.orders || []).map((order) => ({
      id: order.id,
      shippingEmail: order.shippingEmail,
      invoiceEmail: order.invoiceOrder[0]?.invoice.invoiceEmail,
      products: createProduct(order.orderItems),
      productsList: createProductList(order.orderItems),
      datePickUp: createDatePickUp({ dateOfShipping: order.dateOfShipping, datePickUp: order.datePickUp }),
      status: createStatus(order),
      isPaid: !!order.invoiceOrder[0]?.invoice.dateOfPayment,
      totalPrice: currencyFormatter.format(order.totalPrice),
      createdAt: order.createdAt,
      shopName: order.shop?.name || "Livraison à domicile",
      shopId: order.shop?.id || "",
    }));
    return { formatedUser, formattedOrders };
  },
  ["getUserPageData"],
  { revalidate: 60 * 60 * 10, tags: ["users", "orders", "amap-orders", "invoices", "notifications"] },
);

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

  const user = await getUserPageData(params.userId);

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }

  const incomplete =
    !!searchParams.incomplete ||
    user.formatedUser.email?.includes("acompleter") ||
    !user.formatedUser.name ||
    user.formatedUser.name?.includes("acompleter");

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4">
        <UserForm initialData={user.formatedUser} incomplete={incomplete} />
      </div>

      <div>
        <OrderTable data={user.formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;
