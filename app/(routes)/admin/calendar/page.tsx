import { Separator } from "@/components/ui/separator";
import EventPage from "./_components/events-page";
import NewOrderButton from "./_components/new-order-button";
import { makeDateArrayForOrders } from "./_functions/date-array";
import { getGroupedAMAPOrders } from "./_functions/get-amap-orders";

export const revalidate = 86400;

async function CalendarPage() {
  const { dateArray, from } = makeDateArrayForOrders(new Date());
  const amapOrders = await getGroupedAMAPOrders(from);

  return (
    <div className=" flex flex-col gap-2 relative justify-between " style={{ height: `calc(100dvh - 80px)` }}>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between h-20">
        {/* <Link
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
        /> */}

        <NewOrderButton />
      </div>
      <Separator />

      <EventPage amapOrders={amapOrders} dateArray={dateArray} />
    </div>
  );
}

export default CalendarPage;
