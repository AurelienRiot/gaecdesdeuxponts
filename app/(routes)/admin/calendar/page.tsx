import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Package, Plus, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import EventPage from "./_components/events-page";
import { getGroupedAMAPOrders } from "./_functions/get-amap-orders";
import { nanoid } from "nanoid";

export const revalidate = 86400;
// export const dynamic = "force-static";

async function CalendarPage() {
  // const [orders, amapOrders] = await Promise.all([getOrdersByDate({ from, to }), getGroupedAMAPOrders()]);
  const amapOrders = await getGroupedAMAPOrders();

  return (
    <div className=" flex flex-col gap-2 relative" style={{ height: `calc(100dvh - 80px)` }}>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
        <Link href="/admin/users/new" className=" p-2 h-fit border bg-blue-500 rounded-full cursor-pointer flex gap-2">
          <Plus className="size-4 text-green-100 stroke-[3]" />
          <User className="size-4 text-green-100 stroke-[3]" />
        </Link>
        <Heading
          title={`Calendrier des commandes ${nanoid(5)}`}
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
      <div className=" space-y-4 p-8  py-2   w-full">
        <Separator />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <EventPage amapOrders={amapOrders} />
      </Suspense>
    </div>
  );
}

export default CalendarPage;
