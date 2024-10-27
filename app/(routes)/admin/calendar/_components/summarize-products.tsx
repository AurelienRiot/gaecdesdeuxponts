import { AnimateHeight } from "@/components/animations/animate-size";
import { extractProductQuantities, type GroupUsersByProduct } from "@/components/google-events";
import { DisplayProductIcon } from "@/components/product";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { nanoid } from "@/lib/id";
import { cn, numberFormat2Decimals } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import type { DisplayAmapProps } from "./display-amap";
import DisplayItem from "./display-item";

function SummarizeProducts({
  dailyOrders,
  amapOrders,
  className,
}: DisplayAmapProps & { dailyOrders: CalendarOrdersType[]; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const productQuantities = extractProductQuantities(dailyOrders, amapOrders);
  if (productQuantities.aggregateProducts.length === 0) return null;

  return (
    <Card className={cn("w-full max-w-sm rounded-t-md", className)}>
      <CardHeader
        data-state={isExpanded}
        className={
          "flex     data-[state=true]:rounded-b-none  rounded-md  bg-green-200 dark:bg-green-800 items-center justify-between p-2 py-0 cursor-pointer flex-row transition-all delay-300 data-[state=true]:delay-0"
        }
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className=" font-bold  p-2 ">Résumé des produits</h2>
        <ChevronDown
          data-state={isExpanded}
          className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
        />
      </CardHeader>
      <AnimateHeight display={isExpanded}>
        <CardContent className="py-2 px-4 bg-gradient-to-b from-green-200 dark:from-green-800 to-transparent to-[10px] space-y-4">
          {productQuantities.totaleQuantity.map((item) => (
            <p key={nanoid(5)} className="font-bold">
              {item.name} : {numberFormat2Decimals(item.quantity)}
              {item.unit}
            </p>
          ))}
          <DisplayItem
            items={productQuantities.aggregateProducts.map((item) => ({
              name: item.productName,
              quantity: item.totalQuantity,
              unit: item.unit,
            }))}
          />
          <SummarizeUserProducts aggregateProducts={productQuantities.aggregateProducts} />
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

function SummarizeUserProducts({ aggregateProducts }: { aggregateProducts: GroupUsersByProduct[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-base">Clients par produits</h2>
      {aggregateProducts.map((product) => (
        <div key={nanoid(5)} className="space-y-2">
          <h3 className="flex items-center gap-2">
            <DisplayProductIcon name={product.productName} />
            <p
              className={"text-sm font-medium underline underline-offset-2"}
            >{`${product.productName} (${product.totalQuantity}${product.unit})`}</p>
          </h3>
          <ul className="space-y-2">
            {product.users.map((user) => (
              <li key={nanoid(5)} className="grid grid-cols-8  items-center w-full">
                <NameWithImage name={user.userName} image={user.image} imageSize={8} className="col-span-7" />
                <p className="col-span-1">
                  : {user.quantity}
                  {product.unit}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SummarizeProducts;
