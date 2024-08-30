import getOrders from "@/components/google-events/get-orders-for-events";
import { addHours } from "date-fns";
import ModalDay from "./_components/modal-day";
import NoResults from "@/components/ui/no-results";
import ProductDescription from "../../[day]/_components/products-description";
import UpdateEvents from "../../[day]/_components/update-events";
import AMAPDescrition from "../../[day]/_components/amap-description";
import OrderDescriptions from "../../[day]/_components/orders-description";
import { dateFormatter } from "@/lib/date-utils";
import { addDelay } from "@/lib/utils";

async function IntercepteDayPage({ params }: { params: { day: string | undefined } }) {
  const paramDate = params.day ? new Date(decodeURIComponent(params.day)) : new Date();
  const date = addHours(paramDate, 2);
  const startDate = new Date(date.toISOString().split("T")[0]);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  const result = await getOrders({ startDate, endDate }).catch((error) => {
    console.log(error);
  });

  return <ModalDay date={date}>{result ? <DescriptionEvents date={date} result={result} /> : <NoResults />}</ModalDay>;
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
