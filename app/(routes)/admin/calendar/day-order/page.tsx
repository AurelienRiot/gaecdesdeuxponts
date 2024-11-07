import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import getUsersForOrders from "../../orders/[orderId]/_functions/get-users-for-orders";
import DisplayUserForTheDay from "./_components/display-user-for-the-day";
import getDayOrders from "./_functions/get-day-orders";

export const dynamic = "force-dynamic";

async function DayOrderPage() {
  const dayOrders = await getDayOrders();
  const users = await getUsersForOrders();

  return (
    <div className=" space-y-2 " style={{ height: `calc(100dvh - 80px)` }}>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
        <Heading
          title={`Ordre des commandes par jour`}
          description=""
          className=" w-fit  text-center mx-auto"
          titleClassName=" text-lg sm:text-2xl md:text-3xl"
        />
      </div>
      <Separator />

      <div className="flex flex-row w-full gap-4  overflow-y-hidden mx-auto  overflow-x-scroll relative h-full">
        {DAYS_OF_WEEK.map((day, index) => {
          const dayOrdersForDay = dayOrders.find((dayOrder) => dayOrder.day === index);

          return (
            <DisplayUserForTheDay
              dayOrdersForDay={dayOrdersForDay?.dayOrderUsers}
              index={index}
              day={day}
              key={day}
              users={users}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DayOrderPage;
