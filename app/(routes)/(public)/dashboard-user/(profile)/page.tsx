import GetUser from "@/actions/get-user";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrderColumnType } from "./components/order-column";
import { OrderTable } from "./components/order-table";
import ProTab from "./components/pro-tab";
import ProfilTab from "./components/profil-tab";
import { Tab, Tabs, TabsProvider } from "./components/tabs-animate";
import { UserForm } from "./components/user-form";

const DashboardUser = async ({
  searchParams,
}: {
  searchParams: { tab: string };
}) => {
  const user = await GetUser();
  if (!user) redirect("/login");

  const formattedOrders: OrderColumnType[] = (user.orders || []).map(
    (order) => ({
      id: order.id,

      productsList: order.orderItems.map((item) => {
        let name = item.name;
        if (Number(item.quantity) > 1) {
          const quantity = ` x${item.quantity}`;
          return { name, quantity: quantity };
        }
        return { name, quantity: "" };
      }),
      products: order.orderItems
        .map((item) => {
          let name = item.name;
          if (Number(item.quantity) > 1) {
            name += ` x${item.quantity}`;
          }
          return name;
        })
        .join(", "),
      totalPrice: currencyFormatter.format(Number(order.totalPrice)),
      isPaid: order.isPaid,
      datePickUp: order.datePickUp,
      shopName: order.shop.name,
      shop: order.shop,
      createdAt: order.createdAt,
      dataInvoice: {
        customer: {
          id: user.id || "",
          name: user.name || "",
          address: (() => {
            const a =
              user?.address[0] && user?.address[0].line1
                ? `${user?.address[0].line1} ${user?.address[0].postalCode} ${user?.address[0].city}`
                : "";
            return a;
          })(),
          phone: user.phone || "",
          email: user.email || "",
        },
        order: {
          id: order.id,
          dateOfPayment: dateFormatter(order.datePickUp),
          dateOfEdition: dateFormatter(new Date()),
          items: order.orderItems.map((item) => ({
            desc: item.name,
            qty: item.quantity,
            priceTTC: item.price,
          })),
          total: order.totalPrice,
        },
      },
    }),
  );

  const formattedUser = {
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    adress: {
      label: user.address[0]?.label || "",
      city: user.address[0]?.city || "",
      country: user.address[0]?.country || "FR",
      line1: user.address[0]?.line1 || "",
      line2: user.address[0]?.line2 || "",
      postalCode: user.address[0]?.postalCode || "",
      state: user.address[0]?.state || "",
    },
  };

  const tabs: Tab[] = [
    {
      title: "Profil",
      iconId: "user",
      content: (
        <>
          <ProfilTab
            user={{
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
              adress: user.address[0],
              role: user.role as Role,
            }}
          />
        </>
      ),
    },
    {
      title: "Conmmandes",
      iconId: "orders",
      content: (
        <>
          <div className="p-6">
            {formattedOrders.length > 0 ? (
              <OrderTable data={formattedOrders} />
            ) : (
              "  Vous n'avez pas de commandes"
            )}
          </div>
        </>
      ),
    },
    {
      title: "Modifier le profil",
      iconId: "settings",
      content: (
        <>
          <div className="h-full w-full flex-col p-6  ">
            <div className=" flex-1 space-y-4 ">
              <Suspense fallback={null}>
                <UserForm initialData={formattedUser} />
              </Suspense>
            </div>
          </div>
        </>
      ),
    },
  ];

  if (user.role === "pro") {
    tabs.push({
      title: "Prduits Pro",
      iconId: "store",

      content: (
        <Suspense fallback={null}>
          <ProTab />
        </Suspense>
      ),
    });
  }

  return (
    <div className=" relative mx-auto mt-4 flex h-[calc(100vh-297px)] w-full  justify-between gap-4   pr-4 [perspective:1000px] sm:h-[calc(100vh-220px)]">
      <TabsProvider initialTabs={tabs} activeTab={searchParams.tab}>
        <Tabs tabs={tabs} />
      </TabsProvider>
    </div>
  );
};

export default DashboardUser;
