import { AnimateHeight } from "@/components/animations/animate-size";
import type { ProductQuantities } from "@/components/google-events/get-orders-for-events";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import DisplayItem from "../[day]/_components/display-item";

function SummarizeProducts({
  productQuantities,
  className,
}: { productQuantities: ProductQuantities[]; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={cn("w-full max-w-sm ", className)}>
      <CardHeader
        className="flex bg-blue-100 dark:bg-blue-800 items-center justify-between p-2 py-0 cursor-pointer flex-row"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className=" font-bold  p-2 rounded-md">Résumé des produits</h2>
        <ChevronDown
          data-state={isExpanded}
          className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
        />
      </CardHeader>
      <AnimateHeight display={isExpanded}>
        <CardContent className="py-2 px-4 bg-gradient-to-b from-blue-100 dark:from-blue-800 to-transparent to-5%">
          <DisplayItem items={productQuantities} />
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

export default SummarizeProducts;
