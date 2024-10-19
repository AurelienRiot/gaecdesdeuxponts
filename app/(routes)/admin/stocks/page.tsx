import { Heading } from "@/components/ui/heading";
import StockCard from "./_components/stock-card";
import { Suspense } from "react";
import { addDelay } from "@/lib/utils";
import updateBidon5L from "./_actions/update-bidon5L";
import { Separator } from "@/components/ui/separator";

export const revalidate = 86400;

function StocksPage() {
  return (
    <div className="m-4 space-y-4">
      <div className="flex flex-col items-center justify-between sm:flex-row gap-y-2">
        <Heading title={`Stocks`} description="Stocks des différents produits" />
      </div>
      <Separator />
      <Suspense fallback={<StockCard />}>
        <Bidon5LStock />
      </Suspense>
    </div>
  );
}

export default StocksPage;

async function Bidon5LStock() {
  await addDelay(2000);
  return <StockCard title="Bidon de 5 Litres" id="bidon5eL" stock={10} action={updateBidon5L} />;
}
