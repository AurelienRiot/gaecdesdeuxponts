import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";

const DAYS_OF_WEEK = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

async function DayOrderPage() {
  const dayOrders = await prismadb.dayOrder.findMany({ include: { dayOrderUsers: true } });
  const users = await prismadb.user.findMany({
    where: {
      role: { in: ["pro", "user", "trackOnlyUser"] },
    },
  });

  return (
    <div className=" space-y-2 " style={{ height: `calc(100dvh - 80px)` }}>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
        <Heading
          title={`Order des commandes par jour`}
          description=""
          className=" w-fit  text-center mx-auto"
          titleClassName=" text-lg sm:text-2xl md:text-3xl"
        />
      </div>
      <Separator />

      <div className="flex flex-row w-full  overflow-y-hidden mx-auto  overflow-x-scroll relative h-full">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={index} className="w-[400px] flex-shrink-0 h-full">
            {day}
            text
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayOrderPage;
