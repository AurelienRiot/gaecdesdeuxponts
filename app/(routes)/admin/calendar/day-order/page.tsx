import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import getUsersForOrders from "../../orders/[orderId]/_functions/get-users-for-orders";
import { ModalTrigger, UserForTheDayModalProvider } from "./_components/user-for-the-day-modal";
import getDayOrders from "./_functions/get-day-orders";

export const dynamic = "force-dynamic";

async function DayOrderPage() {
  const dayOrders = await getDayOrders();
  const users = await getUsersForOrders();

  return (
    <div className="space-y-6  ">
      <UserForTheDayModalProvider users={users}>
        <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
          <Heading
            title={`Ordre des commandes par jour`}
            description=""
            className=" w-fit  text-center mx-auto"
            titleClassName=" text-lg sm:text-2xl md:text-3xl"
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-4   relative w-full">
          {DAYS_OF_WEEK.map((_, index) => {
            const day = (index + 1) % 7;
            const dayOrdersForDay = dayOrders.find((dayOrder) => dayOrder.day === day) || {
              dayOrderUsers: [],
              day,
            };
            return <ModalTrigger key={day} day={day} userForTheDay={dayOrdersForDay} />;
          })}
        </div>
      </UserForTheDayModalProvider>
    </div>
  );
}

export default DayOrderPage;
