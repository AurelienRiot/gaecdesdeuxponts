import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import { DirectionForm } from "./_components/direction-form";
import OrdersCalendar from "./_components/orders-calendar";

export const dynamic = "force-dynamic";

async function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = searchParams.date ? new Date(decodeURIComponent(searchParams.date)) : new Date();
  const beginMonth = new Date(new Date(month.getFullYear(), month.getMonth(), 1).setHours(0, 0, 0, 0));
  const endMonth = new Date(new Date(month.getFullYear(), month.getMonth() + 1, 1).setHours(0, 0, 0, 0));
  const orders = await prismadb.order.findMany({
    where: {
      dateOfShipping: {
        gte: beginMonth,
        lt: endMonth,
      },
    },
    select: {
      dateOfShipping: true,
    },
    distinct: ["dateOfShipping"],
  });
  const orderDates: Date[] = orders.map((order) => order.dateOfShipping).filter((date): date is Date => date !== null);

  const users = await prismadb.user
    .findMany({
      where: { role: { notIn: ["readOnlyAdmin", "admin", "deleted"] } },
      select: { name: true, company: true, image: true, address: true },
    })
    .then((u) =>
      u.map((user) => ({
        label: user.company || user.name || "",
        image: user.image,
        address: addressFormatter(user.address, true),
      })),
    );
  const shops = await prismadb.shop.findMany({ select: { name: true, address: true, imageUrl: true } }).then((s) =>
    s.map((shop) => ({
      label: shop.name || "",
      address: shop.address,
      image: shop.imageUrl,
    })),
  );

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
      <OrdersCalendar month={month} orderDates={orderDates} />
      <DirectionForm usersAndShops={[...users, ...shops]} />
    </div>
  );
}

export default CalendarPage;
