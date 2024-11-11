import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ONE_DAY } from "@/lib/date-utils";
import { addDays } from "date-fns";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import EventPage from "./_components/events-page";
import NewOrderButton from "./_components/new-order-button";
import { OrdersModalProvider } from "./_components/orders-modal";
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
  const from = addDays(new Date(), -20);
  const to = addDays(new Date(), 30);
  const dateArray = makeDateArray({ from, to });
  const amapOrders = await getGroupedAMAPOrders();

  return (
    <OrdersModalProvider>
      <UserModalProvider>
        <div className=" flex flex-col gap-2 relative justify-between " style={{ height: `calc(100dvh - 80px)` }}>
          <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
            <Link
              href="/admin/users/new"
              className=" p-2 h-fit border bg-blue-500 transition-colors hover:bg-blue-400 rounded-full cursor-pointer flex gap-2"
            >
              <Plus className="size-4 text-blue-100 stroke-[3]" />
              <User className="size-4 text-blue-100 stroke-[3]" />
            </Link>
            <Heading
              title={`Calendrier des commandes`}
              description=""
              className=" w-fit  text-center mx-auto"
              titleClassName=" text-lg sm:text-2xl md:text-3xl"
            />

            <NewOrderButton />
          </div>
          <Separator />

          <EventPage amapOrders={amapOrders} initialDateArray={dateArray} />
        </div>
      </UserModalProvider>
    </OrdersModalProvider>
  );
}

export default CalendarPage;
