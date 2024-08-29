import getOrders from "@/components/google-events/get-orders-for-events";
import { Heading } from "@/components/ui/heading";
import NoResults from "@/components/ui/no-results";
import { Separator } from "@/components/ui/separator";
import { dateFormatter } from "@/lib/date-utils";
import { addHours } from "date-fns";
import AMAPDescrition from "./_components/amap-description";
import OrderDescriptions from "./_components/orders-description";
import ProductDescrition from "./_components/products-description";
import UpdateEvents from "./_components/update-events";
import { Skeleton } from "@/components/skeleton-ui/skeleton";

export const dynamic = "force-dynamic";

const DayEventPage = async ({ params }: { params: { day: string | undefined } }) => {
  const paramDate = params.day ? new Date(decodeURIComponent(params.day)) : new Date();
  const date = addHours(paramDate, 2);
  const startDate = new Date(date.toISOString().split("T")[0]);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  const result = await getOrders({ startDate, endDate }).catch((error) => {
    console.log(error);
  });

  return (
    <div className="space-y-4 p-8 pt-6 ">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading
          title={`Commandes pour le ${dateFormatter(date, { days: true })} `}
          description="Liste des différentes commandes et livraisons"
          className="w-fit mx-auto"
        />

        {/* <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Link href={`/admin/amap/new`}>
            <Plus className="mr-2  h-4 w-4" />
            Créer un nouveau
          </Link>
        </Button> */}
      </div>
      <Separator />
      {result ? <DescriptionEvents date={date} result={result} /> : <NoResults />}
    </div>
  );
};

export default DayEventPage;

function DescriptionEvents({ result, date }: { result: Awaited<ReturnType<typeof getOrders>>; date: Date }) {
  const { formattedOrders, groupedAMAPOrders, productQuantities } = result;

  if (productQuantities.length === 0) {
    return <p className="text-destructive">Aucune commande pour le {dateFormatter(date, { days: true })}</p>;
  }

  return (
    <div className="space-y-4 mx-auto w-fit">
      <ProductDescrition productQuantities={productQuantities} />
      {/* <UpdateEvents date={date} /> */}
      <AMAPDescrition groupedAMAPOrders={groupedAMAPOrders} />
      <OrderDescriptions formattedOrders={formattedOrders} />
    </div>
  );
}
