import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { directionRouteXL } from "./_actions/opt-routes";
import OrdersCalendar from "./_components/orders-calendar";

export const dynamic = "force-dynamic";

function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = searchParams.date ? new Date(decodeURIComponent(searchParams.date)) : new Date();

  async function getDirection() {
    const origin = "6 le Pont Robert 44290 Massérac, France";
    const destination = "6 le Pont Robert 44290 Massérac, France";
    const waypoints = [
      "2 Pl. de l'Eglise 44290 Guémené-Penfao, France",
      "7 Rue de l'Eglise 44290 Guémené-Penfao, France",
      "La Bourg 35550 Saint-Ganton, France",
    ];
    await directionRouteXL();
    // await direction({ origin, destination, waypoints });
  }

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
