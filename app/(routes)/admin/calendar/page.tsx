import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ONE_DAY } from "@/lib/date-utils";
import { addDays } from "date-fns";
import { Package, Plus, User } from "lucide-react";
import Link from "next/link";
import TodayFocus from "./_components/date-focus";
import EventPage from "./_components/events-page";
import { OrdersModalProvider } from "./_components/orders-modal";
import UpdatePage from "./_components/update-page";
import { UserModalProvider } from "./_components/user-modal";
import { getGroupedAMAPOrders } from "./_functions/get-amap-orders";

export const revalidate = 86400;

function makeDateArray({ from, to }: { from: Date; to: Date }) {
  const arrayLength = Math.round((to.getTime() - from.getTime()) / ONE_DAY);
  return new Array(arrayLength).fill(0).map((_, index) => {
    return new Date(from.getTime() + index * ONE_DAY).toISOString().split("T")[0];
  });
}

async function CalendarPage() {
  const from = addDays(new Date(), -14);
  const to = addDays(new Date(), 30);
  const dateArray = makeDateArray({ from, to });
  // const [orders, amapOrders] = await Promise.all([getOrdersByDate({ from, to }), getGroupedAMAPOrders()]);
  // const stocks = await getStocks();
  // for (const stock of stocks) {
  //   console.log(stock.name, " : ", stock.totalQuantity);
  // }
  const amapOrders = await getGroupedAMAPOrders();

  return (
    <OrdersModalProvider>
      <UserModalProvider>
        <div className=" flex flex-col gap-2 relative justify-between " style={{ height: `calc(100dvh - 80px)` }}>
          <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
            <Link
              href="/admin/users/new"
              className=" p-2 h-fit border bg-blue-500 rounded-full cursor-pointer flex gap-2"
            >
              <Plus className="size-4 text-green-100 stroke-[3]" />
              <User className="size-4 text-green-100 stroke-[3]" />
            </Link>
            <Heading
              title={`Calendrier des commandes`}
              description=""
              className=" w-fit  text-center mx-auto"
              titleClassName=" text-lg sm:text-2xl md:text-3xl"
            />

            <Link
              href="/admin/orders/new"
              className=" p-2 h-fit border bg-green-500 rounded-full cursor-pointer flex gap-2"
            >
              <Plus className="size-4 text-green-100 stroke-[3]" />
              <Package className="size-4 text-green-100 stroke-[3]" />
            </Link>
          </div>
          <Separator />

          <EventPage amapOrders={amapOrders} initialDateArray={dateArray} />

          <div className="flex justify-between p-4 max-w-[500px] mx-auto w-full">
            <UpdatePage />
            <TodayFocus startMonth={new Date(dateArray[0])} endMonth={new Date(dateArray[dateArray.length - 1])} />
          </div>
        </div>
      </UserModalProvider>
    </OrdersModalProvider>
  );
}

export default CalendarPage;
