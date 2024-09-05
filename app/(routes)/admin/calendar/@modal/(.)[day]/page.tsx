import getOrders from "@/components/google-events/get-orders-for-events";
import NoResults from "@/components/ui/no-results";
import { dateFormatter } from "@/lib/date-utils";
import { addHours } from "date-fns";
import AMAPDescrition from "../../[day]/_components/amap-description";
import OrderDescriptions from "../../[day]/_components/orders-description";
import ProductDescription from "../../[day]/_components/products-description";
import UpdateEvents from "../../[day]/_components/update-events";
import ModalDay from "./_components/modal-day";

export const dynamic = "force-dynamic";

async function IntercepteDayPage({ params }: { params: { day: string | undefined } }) {
  const paramDate = params.day ? new Date(decodeURIComponent(params.day)) : new Date();
  const startDate = paramDate;
  const endDate = addHours(startDate, 24);
  console.log({ startDate, endDate });

  const result = await getOrders({ startDate, endDate }).catch((error) => {
    console.log(error);
  });

  return (
    <ModalDay date={startDate}>
      {result ? <DescriptionEvents date={startDate} result={result} /> : <NoResults />}
    </ModalDay>
  );
}

export default IntercepteDayPage;

function DescriptionEvents({ result, date }: { result: Awaited<ReturnType<typeof getOrders>>; date: Date }) {
  const { formattedOrders, groupedAMAPOrders, productQuantities } = result;

  if (productQuantities.length === 0) {
    return <p className="text-destructive">Aucune commande pour le {dateFormatter(date, { days: true })}</p>;
  }

  return (
    <div className="space-y-4 mx-auto w-fit">
      <ProductDescription productQuantities={productQuantities} />
      <AMAPDescrition groupedAMAPOrders={groupedAMAPOrders} />
      <OrderDescriptions formattedOrders={formattedOrders} />
      <UpdateEvents date={date} />
    </div>
  );
}
