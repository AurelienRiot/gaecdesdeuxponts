import { formatter } from "@/lib/utils";
import GetUser from "@/actions/get-user";
import { redirect } from "next/navigation";
import { OrderColumnType } from "./components/order-column";
import { OrderTable } from "./components/order-table";
import { UserButtons } from "./components/user-buttons";

const DashboardUser = async () => {
  const user = await GetUser();
  if (!user) redirect("/login");

  const formattedOrders: OrderColumnType[] = (user.orders || []).map(
    (order) => ({
      id: order.id,

      products: order.orderItems
        .map((item) => {
          let name = item.product.name;
          if (Number(item.quantity) > 1) {
            name += ` x${item.quantity}`;
          }
          return name;
        })
        .join(", "),
      totalPrice: formatter.format(Number(order.totalPrice)),
      pdfUrl: order.pdfUrl,
      datePickUp: order.datePickUp,
      createdAt: order.createdAt,
    }),
  );

  const address = user.address[0];

  return (
    <div className="mb-4 mt-4 gap-4">
      <div className="mx-auto mb-4 flex h-fit w-fit flex-col items-center justify-center gap-2 rounded-md border-2 p-6 text-gray-800 shadow-xl dark:text-white">
        <>
          <h1 className="text-center text-3xl font-bold">
            <span className="capitalize">
              {user.name ? user.name : "Compléter votre profil"}
            </span>
          </h1>
        </>
        <UserButtons />
      </div>
      <div className="text-md flex flex-col items-center justify-center text-gray-800 dark:text-white sm:text-xl">
        <div className="grid grid-cols-1 items-center justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-start">
          <p className="font-bold ">Email :</p>
          <p>{user.email}</p>
          <p className="font-bold">Adresse :</p>
          {address?.line1 ? (
            <p>
              {address.line1} {address.postalCode} {address.city}{" "}
            </p>
          ) : (
            <p>Non renseigné</p>
          )}

          <p className="font-bold">Télephone :</p>
          <p>{user.phone ? user.phone : "Non renseigné"}</p>
        </div>
      </div>

      <div className="p-4">
        {formattedOrders.length > 0 ? (
          <OrderTable data={formattedOrders} />
        ) : null}

        {/* <ButtonSubscriptions stripeCustomerId={user.stripeCustomerId} /> */}
      </div>
    </div>
  );
};

export default DashboardUser;
