import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import { DirectionForm } from "./_components/direction-form";
import OrdersCalendar from "./_components/orders-calendar";
import { addHours } from "date-fns";
import { getAllShops } from "@/actions/get-shops";
import { getSearchUsers } from "@/actions/get-user";
import { getOrdersByDateOfShipping } from "@/actions/get-orders";

export const dynamic = "force-dynamic";

async function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = addHours(searchParams.date ? new Date(decodeURIComponent(searchParams.date)) : new Date(), 2);

  const beginMonth = new Date(new Date(month.getFullYear(), month.getMonth(), 1).setHours(0, 0, 0, 0));
  const endMonth = new Date(new Date(month.getFullYear(), month.getMonth() + 1, 1).setHours(0, 0, 0, 0));

  const promises = await Promise.all([
    getSearchUsers(),
    getAllShops(),
    getOrdersByDateOfShipping({ beginMonth, endMonth }),
  ]).then(([users, shops, orderDates]) => {
    const userMap = new Map(
      users.map((user) => [
        user.company || user.name || "",
        {
          label: user.company || user.name || "",
          image: user.image,
          address: addressFormatter(user.address, true),
        },
      ]),
    );

    for (const shop of shops) {
      if (!userMap.has(shop.name)) {
        userMap.set(shop.name, {
          label: shop.name,
          address: shop.address,
          image: shop.imageUrl,
        });
      }
    }

    return { usersAndShops: Array.from(userMap.values()), orderDates };
  });

  const { usersAndShops, orderDates } = promises;

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
      <OrdersCalendar month={month} orderDates={orderDates.map((date) => new Date(date))} />
      <DirectionForm usersAndShops={usersAndShops} />
    </div>
  );
}

export default CalendarPage;
