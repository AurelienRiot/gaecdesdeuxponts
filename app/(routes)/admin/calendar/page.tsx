import { getOrdersByDate } from "@/app/(routes)/admin/calendar/_functions/get-orders";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ONE_DAY } from "@/lib/date-utils";
import { addDays } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import EventPage from "./_components/events-page";
import { getGroupedAMAPOrders } from "./_functions/get-amap-orders";

export const dynamic = "force-dynamic";

const from = new Date(new Date().getTime() - 14 * ONE_DAY);
const to = addDays(new Date(), 30);
const dateArray = new Array((to.getTime() - from.getTime()) / ONE_DAY).fill(0).map((_, index) => {
  return new Date(from.getTime() + index * ONE_DAY).toISOString().split("T")[0];
});
async function CalendarPage() {
  const [orders, amapOrders] = await Promise.all([getOrdersByDate({ from, to }), getGroupedAMAPOrders()]);

  return (
    <div className=" flex flex-col gap-2 relative" style={{ height: `calc(100dvh - 80px)` }}>
      <Link
        href="/admin/orders/new"
        className="absolute top-4 right-4 p-2 border bg-green-500 rounded-full cursor-pointer"
      >
        <Plus className="size-4 text-green-100 stroke-[3]" />
      </Link>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto ">
        <div className=" space-y-4 p-8  py-2   w-full">
          <Heading
            title={`Calendrier des commandes`}
            description="Liste des commandes"
            className=" w-fit  text-center mx-auto"
          />
          <Separator />{" "}
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <EventPage orders={orders} amapOrders={amapOrders} dateArray={dateArray} />
      </Suspense>
    </div>
  );
}

export default CalendarPage;
