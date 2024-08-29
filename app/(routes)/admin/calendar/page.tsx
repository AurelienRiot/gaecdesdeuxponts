import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import OrdersCalendar from "./_components/orders-calendar";
import { directionGoogle } from "./_actions/direction-google";

export const dynamic = "force-dynamic";

function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const month = searchParams.date ? new Date(decodeURIComponent(searchParams.date)) : new Date();

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
      <OrdersCalendar month={month} />
      {/* <form action={getDirection}>
        <Button>Get Directions</Button>
      </form> */}
    </>
  );
}

export default CalendarPage;
