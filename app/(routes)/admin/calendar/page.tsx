import { getOrdersByDateOfShipping } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { addressFormatter } from "@/lib/utils";
import { addHours } from "date-fns";
import { DirectionForm } from "./_components/direction-form";
import OrdersCalendar from "./_components/orders-calendar";
import { getAMAPOrders } from "./_functions/get-amap-orders";
import { getAllShops } from "./_functions/get-shops";
import { getSearchUsers } from "./_functions/get-users";

export const dynamic = "force-dynamic";

async function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = addHours(searchParams.date ? new Date(decodeURIComponent(searchParams.date)) : new Date(), 2);

  const beginMonth = new Date(new Date(month.getFullYear(), month.getMonth(), 1).setHours(0, 0, 0, 0));
  const endMonth = new Date(new Date(month.getFullYear(), month.getMonth() + 1, 1).setHours(0, 0, 0, 0));

  const { usersAndShops, orderDates } = await Promise.all([
    getSearchUsers(),
    getAllShops(),
    getOrdersByDateOfShipping({ beginMonth, endMonth }),
    getAMAPOrders({ beginMonth, endMonth }),
  ]).then(([users, shops, orderDates, amapDates]) => {
    const shopsMap = new Map(
      shops.map((shop) => [
        shop.name,
        {
          label: shop.name,
          image: shop.imageUrl,
          address: shop.address,
        },
      ]),
    );

    for (const user of users) {
      if (!shopsMap.has(user.name || user.company || "")) {
        shopsMap.set(user.name || user.company || "", {
          label: user.company || user.name || "",
          image: user.image,
          address: addressFormatter(user.address, true),
        });
      }
    }

    return { usersAndShops: Array.from(shopsMap.values()), orderDates: new Set(orderDates.concat(amapDates)) };
  });

  return (
    <div className="max-w-[90vw] md:max-w-[500px] mx-auto">
      <div className=" space-y-4 p-8  pt-2   w-full">
        <Heading
          title={`Calendrier des commandes`}
          description="Liste des commandes"
          className=" w-fit  text-center mx-auto"
        />

        <Separator />
      </div>
      <OrdersCalendar month={month} orderDates={[...orderDates].map((date) => new Date(date))} />
      <DirectionForm usersAndShops={usersAndShops} />
    </div>
  );
}

export default CalendarPage;
