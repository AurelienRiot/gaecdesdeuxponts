import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { directionGoogle } from "./_actions/direction-google";
import OrdersCalendar from "./_components/orders-calendar";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";

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

  async function getDirection() {
    "use server";

    const origin = "6 le Pont Robert 44290 Massérac, France";
    const destination = "Pont de l'Eau, 44460 Avessac, France";
    const waypoints = [
      "2 Pl. de l'Eglise 44290 Guémené-Penfao, France",
      "7 Rue de l'Eglise 44290 Guémené-Penfao, France",
      "La Bourg 35550 Saint-Ganton, France",
    ];
    await directionGoogle({ origin, destination, waypoints });
  }

  return (
    <>
      <div className=" space-y-4 p-8  pt-2 ">
        <Heading
          title={`Calendrier des commandes`}
          description="Liste des commandes"
          className="mx-auto w-fit  text-center"
        />

        <Separator />
      </div>
      <OrdersCalendar month={month} orderDates={orderDates} />
      <form action={getDirection}>
        <Button>Get Directions</Button>
      </form>
    </>
  );
}

export default CalendarPage;
