import { getUserName } from "@/components/table-custom-fuction";
import { createProduct, createProductList } from "@/components/table-custom-fuction/cell-orders";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import NoResults from "@/components/ui/no-results";
import { Separator } from "@/components/ui/separator";
import { dateFormatter } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import { addDays, setHours } from "date-fns";
import { Plus } from "lucide-react";
import * as Dynamic from "next/dynamic";
import Link from "next/link";
import AmapCards from "./_components/amap-cards";
import { AMAPClient } from "./_components/client";
import type { AMAPColumn } from "./_components/columns";
import SelectShippingDay from "./_components/select-shipping-day";

export const dynamic = "force-dynamic";

async function AMAPPage(context: {
  searchParams: {
    date: string | undefined;
    id: string | undefined;
    shippingDay: string | undefined;
  };
}) {
  const id = context.searchParams.id;

  const date = context.searchParams.date;
  const endDate = addDays(date ? new Date(date) : new Date(), -1);

  const amapOrders = await prismadb.aMAPOrder.findMany({
    where: !id
      ? {
          endDate: {
            gte: endDate,
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
    name: getUserName(order.user),
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
      <NextShipping formattedOrders={formattedOrders} shippingDay={context.searchParams.shippingDay} />

      <Separator />
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
      <AMAPClient initialData={formattedOrders} endDate={endDate} />
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
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  setHours(today, 23);
  const nextDay = (() => {
    for (const date of arrayShippingDays) {
      if (date.getTime() <= addDays(today, 4).getTime()) {
        return date;
      }
    }
  })();

  if (!nextDay) {
    return <NoResults />;
  }
  const selectedShippingDay = shippingDay ? new Date(shippingDay) : nextDay;

  const ordersForNextShipping = formattedOrders.filter((order) =>
    order.shippingDays.some((shippingDay) => shippingDay.getTime() === selectedShippingDay.getTime()),
  );

  return (
    <>
      <Heading title={`Commande pour la prochaine livraison`} description={""} />{" "}
      <div className="flex flex-wrap gap-2">
        <SelectShippingDay
          shippingDays={arrayShippingDays}
          selectedShippingDay={selectedShippingDay}
          nextDay={nextDay}
        />
        {/* <DownloadCards className="size-10" date={dateFormatter(selectedShippingDay, { days: true })} /> */}
      </div>
      <div className="flex flex-wrap justify-center  gap-4">
        {ordersForNextShipping.map((order) => (
          <AmapCards
            shippedDay={selectedShippingDay}
            shipped={order.shippedDays.some((shippingDay) => shippingDay.getTime() === selectedShippingDay.getTime())}
            id={order.id}
            shopName={order.shopName}
            name={order.name}
            productsList={order.productsList}
            userId={order.userId}
            key={`${order.id}-${selectedShippingDay.toISOString()}`}
          />
        ))}
      </div>
      <CardsForDowload ordersForNextShipping={ordersForNextShipping} selectedShippingDay={selectedShippingDay} />
    </>
  );
}
const splitOrdersIntoPages = (orders: AMAPColumn[], cardsPerPage: number) => {
  const pages = [];
  for (let i = 0; i < orders.length; i += cardsPerPage) {
    pages.push(orders.slice(i, i + cardsPerPage));
  }
  return pages;
};
const cardsPerPage = 10;
function CardsForDowload({
  ordersForNextShipping,
  selectedShippingDay,
}: { ordersForNextShipping: AMAPColumn[]; selectedShippingDay: Date }) {
  const pages = splitOrdersIntoPages(ordersForNextShipping, cardsPerPage);

  return (
    <>
      <div id="amap-cards" className=" w-[800px] p-4  bg-white hidden ">
        <h1 className="text-3xl font-bold text-center">
          Commandes AMAP du {dateFormatter(selectedShippingDay, { days: true })}
        </h1>
        {pages.map((pageOrders, pageIndex) => (
          <div key={pageIndex} className="page-break mt-20">
            <div className="flex flex-wrap justify-center gap-4 mx-auto items-center">
              {pageOrders.map((order, index) => (
                <AmapCards
                  className="max-w-[45%] h-fit"
                  shippedDay={selectedShippingDay}
                  shipped={order.shippedDays.some(
                    (shippingDay) => shippingDay.getTime() === selectedShippingDay.getTime(),
                  )}
                  id={order.id}
                  shopName={order.shopName}
                  name={order.name}
                  productsList={order.productsList}
                  userId={order.userId}
                  key={`${order.id}-${pageIndex}-${index}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
