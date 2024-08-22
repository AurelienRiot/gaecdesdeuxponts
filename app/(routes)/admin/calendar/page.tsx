import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import OrdersCalendar from "./_components/orders-calendar";
import prismadb from "@/lib/prismadb";

async function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = searchParams.date ? new Date(searchParams.date) : new Date();
  const from = new Date(month.getFullYear(), month.getMonth(), 1);
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const orders = await prismadb.order.findMany({
    include: {
      orderItems: true,
      shop: true,
      user: { include: { address: true, billingAddress: true } },
      customer: true,
    },
    where: {
      dateOfShipping: {
        gte: from,
        lte: to,
      },
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title={`Calendrier des commandes`} description="Liste des commandes" />

        <Separator />
        <OrdersCalendar month={month} />
      </div>
    </div>
  );
}

export default CalendarPage;
