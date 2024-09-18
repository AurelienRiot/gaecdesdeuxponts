import getAllOrders from "@/components/google-events/get-orders-for-events";
import NoResults from "@/components/ui/no-results";
import { dateFormatter, timeZone } from "@/lib/date-utils";
import { addHours } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Suspense } from "react";
import AMAPDescrition from "../../[day]/_components/amap-description";
import OrderDescriptions from "../../[day]/_components/orders-description";
import ProductDescription from "../../[day]/_components/products-description";
import UpdateEvents from "../../[day]/_components/update-events";
import Loading from "../_loading";
import SheetDay from "./_components/sheet-day";

export const dynamic = "force-dynamic";

async function IntercepteDayPage({ params }: { params: { day: string | undefined } }) {
  const paramDate = params.day ? new Date(decodeURIComponent(params.day)) : new Date();
  const start = formatInTimeZone(paramDate, timeZone, "yyyy-MM-dd");
  const end = formatInTimeZone(addHours(paramDate, 24), timeZone, "yyyy-MM-dd");

  const startDate = fromZonedTime(start, timeZone);
  const endDate = fromZonedTime(end, timeZone);

  return (
    <SheetDay date={startDate}>
      <Suspense fallback={<Loading />}>
        <DescriptionEvents startDate={startDate} endDate={endDate} />
      </Suspense>
    </SheetDay>
  );
}

export default IntercepteDayPage;

async function DescriptionEvents({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const result = await getAllOrders({ startDate, endDate }).catch((error) => {
    console.log(error);
  });
  if (!result) {
    return <NoResults />;
  }
  const { formattedOrders, groupedAMAPOrders, productQuantities } = result;

  if (productQuantities.length === 0) {
    return <p className="text-destructive">Aucune commande pour le {dateFormatter(startDate, { days: true })}</p>;
  }

  return (
    <div className="space-y-4 mx-auto w-fit">
      <ProductDescription productQuantities={productQuantities} />
      <AMAPDescrition groupedAMAPOrders={groupedAMAPOrders} />
      <OrderDescriptions formattedOrders={formattedOrders} />
      <UpdateEvents date={startDate} />
    </div>
  );
}
