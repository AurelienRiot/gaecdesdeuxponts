import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { dateFormatter } from "@/lib/date-utils";
import type { SearchParams } from "@/types";
import { Suspense } from "react";
import NewStockModal from "./_components/new-stock-modal";
import StockCard from "./_components/stock-card";
import { getStocks } from "./_functions/get-stocks";

export const dynamic = "force-dynamic";

interface StockSearchParams extends SearchParams {
  modal?: string;
}

function StocksPage(props: { searchParams: Promise<StockSearchParams> }) {
  const today = new Date();
  console.log(today, dateFormatter(today, { hours: true }));
  return (
    <div className="m-4 space-y-4">
      <div className="flex flex-col items-center justify-between sm:flex-row gap-y-2">
        <Heading title={`Stocks`} description="Stocks des différents produits" />
        <NewStockModal />
      </div>
      <Separator />
      <Suspense fallback={<StockCard />}>
        <DisplayStock />
      </Suspense>
    </div>
  );
}

export default StocksPage;

async function DisplayStock() {
  const stocks = await getStocks();
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {stocks.map((stock) => (
        <StockCard key={stock.id} id={stock.id} title={stock.name} name={stock.name} stock={stock.totalQuantity} />
      ))}
    </div>
  );
}
