import { AnimateHeight } from "@/components/animations/animate-size";
import type { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, numberFormat2Decimals } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import DisplayItem from "./display-item";

function SummarizeProducts({
  productQuantities,
  className,
}: { productQuantities: ReturnType<typeof extractProductQuantities>; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("w-full max-w-sm ", className)}>
      <CardHeader
        className="flex bg-green-200 dark:bg-green-800 items-center justify-between p-2 py-0 cursor-pointer flex-row"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className=" font-bold  p-2 rounded-md">Résumé des produits</h2>
        <ChevronDown
          data-state={isExpanded}
          className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
        />
      </CardHeader>
      <AnimateHeight display={isExpanded}>
        <CardContent className="py-2 px-4 bg-gradient-to-b from-green-200 dark:from-green-800 to-transparent to-5% space-y-4">
          {productQuantities.totaleQuantity.map((item) => (
            <p key={item.name} className="font-bold">
              {item.name} : {numberFormat2Decimals(item.quantity)}
              {item.unit}
            </p>
          ))}
          <DisplayItem items={productQuantities.aggregateProducts} />
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

export default SummarizeProducts;
