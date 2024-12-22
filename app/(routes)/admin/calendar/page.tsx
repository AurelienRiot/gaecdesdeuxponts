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
        <NewOrderButton />
      </div>
      <Separator />

      <EventPage amapOrders={amapOrders} dateArray={dateArray} />
    </div>
  );
}

export default CalendarPage;
