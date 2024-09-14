import { createProduct, createProductList } from "@/components/table-custom-fuction/cell-orders";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import NoResults from "@/components/ui/no-results";
import { Separator } from "@/components/ui/separator";
import { getDaysInFuture, getNextDay } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import AmapCards from "./_components/amap-cards";
import { AMAPClient } from "./_components/client";
import type { AMAPColumn } from "./_components/columns";
import SelectShippingDay from "./_components/select-shipping-day";

export const dynamic = "force-dynamic";

async function AMAPPage(context: {
  searchParams: {
    from: string | undefined;
    to: string | undefined;
    id: string | undefined;
    shippingDay: string | undefined;
  };
}) {
  const id = context.searchParams.id;

  let from: Date;
  let to: Date;
  if (context.searchParams.from && context.searchParams.to) {
    from = new Date(context.searchParams.from);
    to = new Date(context.searchParams.to);
  } else {
    from = new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    to = new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 60 * 1000);
  }

  const dateRange: DateRange = {
    from: from,
    to: to,
  };

  const amapOrders = await prismadb.aMAPOrder.findMany({
    where: !id
      ? {
          startDate: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        }
      : {
          id: {
            contains: id,
          },
        },
    orderBy: { createdAt: "desc" },
    include: { user: true, amapItems: true, shop: true },
  });

  const formattedOrders: AMAPColumn[] = amapOrders.map((order) => ({
    id: order.id,
    userId: order.user.id,
    name: order.user.company || order.user.name || order.user.email || "",
    shopName: order.shop.name,
    shopId: order.shop.id,
    totalPrice: order.totalPrice,
    totalPaid: order.totalPaid,
    startDate: order.startDate,
    endDate: order.endDate,
    shippingDays: order.shippingDays,
    shippedDays: order.shippedDays,
    dateOfEdition: order.dateOfEdition,
    productsList: createProductList(order.amapItems),
    products: createProduct(order.amapItems),
  }));

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading title={`Contrat AMAP (${amapOrders.length})`} description="Liste des différents contrats AMAP" />

        {/* <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
            <Link href={`/admin/amap/formulaire`}>
              <Plus className="mr-2  h-4 w-4" />
              Créer un formulaire
            </Link>
          </Button> */}
        <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Link href={`/admin/amap/new`}>
            <Plus className="mr-2  h-4 w-4" />
            Créer un contrat
          </Link>
        </Button>
      </div>

      <Separator />
      <AMAPClient initialData={formattedOrders} initialDateRange={dateRange} />
      <Separator />

      <NextShipping formattedOrders={formattedOrders} shippingDay={context.searchParams.shippingDay} />
    </div>
  );
}

export default AMAPPage;

function NextShipping({ formattedOrders, shippingDay }: { formattedOrders: AMAPColumn[]; shippingDay?: string }) {
  const allShippingDays = new Set(
    formattedOrders.flatMap((order) => order.shippingDays.map((shippingDay) => shippingDay.getTime())),
  );
  const arrayShippingDays = Array.from(allShippingDays)
    .map((shippingDay) => new Date(shippingDay))
    .sort((a, b) => a.getTime() - b.getTime());
  const nextDay = getNextDay(getDaysInFuture(arrayShippingDays));

  if (!nextDay) {
    return <NoResults />;
  }
  const selectedShippingDay = shippingDay ? new Date(shippingDay) : nextDay;

  const ordersForNextShipping = formattedOrders.filter((order) =>
    order.shippingDays.some((shippingDay) => shippingDay.getTime() === selectedShippingDay.getTime()),
  );

  return (
    <>
      <Heading title={`Commande pour la prochaine livraison`} description={""} />
      <SelectShippingDay shippingDays={arrayShippingDays} selectedShippingDay={selectedShippingDay} nextDay={nextDay} />
      <div className="flex flex-wrap justify-center  gap-4">
        {ordersForNextShipping.map((order) => (
          <AmapCards
            shippedDay={selectedShippingDay}
            shipped={order.shippedDays.some((shippingDay) => shippingDay.getTime() === selectedShippingDay.getTime())}
            id={order.id}
            name={order.name}
            productsList={order.productsList}
            userId={order.userId}
            key={order.id}
          />
        ))}
      </div>
    </>
  );
}
