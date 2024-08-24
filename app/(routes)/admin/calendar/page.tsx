"use client";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import GoogleCalendar from "./_components/google-calendar";
import OrdersCalendar from "./_components/orders-calendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { directionRouteXL } from "./_actions/opt-routes";

export const dynamic = "force-dynamic";

function CalendarPage({ searchParams }: { searchParams: { date: string | undefined } }) {
  const [date, setDate] = useState(new Date());
  const month = searchParams.date ? new Date(searchParams.date) : date;
  const from = new Date(month.getFullYear(), month.getMonth(), 1);
  const to = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // const orders = await prismadb.order.findMany({
  //   include: {
  //     orderItems: true,
  //     shop: true,
  //     user: { include: { address: true, billingAddress: true } },
  //     customer: true,
  //   },
  //   where: {
  //     dateOfShipping: {
  //       gte: from,
  //       lte: to,
  //     },
  //   },
  // });
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
        <OrdersCalendar month={month} date={date} setDate={setDate} />
        <GoogleCalendar date={date} />
        <Button onClick={getDirection}>Get direction</Button>
      </div>
    </div>
  );
}

export default CalendarPage;
