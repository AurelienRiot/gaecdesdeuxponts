import { AnimateHeight } from "@/components/animations/animate-size";
import { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { getUnitLabel } from "@/components/product/product-function";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, numberFormat2Decimals } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import type { DisplayAmapProps } from "./display-amap";
import DisplayItem from "./display-item";
import { getUserName } from "@/components/table-custom-fuction";
import { DisplayProductIcon } from "@/components/product";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";

function SummarizeProducts({
  dailyOrders,
  amapOrders,
  className,
}: DisplayAmapProps & { dailyOrders: CalendarOrdersType[]; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const productQuantities = extractProductQuantities(
    dailyOrders
      .flatMap((order) =>
        order.productsList.map((item) => ({
          itemId: item.name,
          name: item.name,
          price: item.price,
          quantity: Number(item.quantity || 1),
          unit: getUnitLabel(item.unit).quantity,
        })),
      )
      .concat(
        amapOrders.flatMap(
          (shop) =>
            shop.order?.items.map((item) => ({
              itemId: item.itemId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              unit: item.unit,
            })) || [],
        ),
      ),
  );
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
        <CardContent className="py-2 px-4 bg-gradient-to-b from-green-200 dark:from-green-800 to-transparent to-[15px] space-y-4">
          {productQuantities.totaleQuantity.map((item) => (
            <p key={item.name} className="font-bold">
              {item.name} : {numberFormat2Decimals(item.quantity)}
              {item.unit}
            </p>
          ))}
          <DisplayItem items={productQuantities.aggregateProducts} />
          <SummarizeUserProducts dailyOrders={dailyOrders} />
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

type ProductOrders = {
  productId: string;
  productName: string;
  unit?: string;
  users: {
    userId: string;
    image?: string | null;
    userName: string;
    quantity: number;
  }[];
};

function groupOrdersByProduct(orders: CalendarOrdersType[]): ProductOrders[] {
  const productMap = new Map<string, ProductOrders>();

  for (const order of orders) {
    const userName = getUserName(order.user);
    const userId = order.user.id;
    const image = order.user.image;

    for (const product of order.productsList) {
      const { itemId, name, unit, quantity, price } = product;

      // **Exclude products with negative quantity**
      if (quantity <= 0 || price <= 0) {
        break; // Skip this product
      }

      if (!productMap.has(name)) {
        productMap.set(name, {
          productId: itemId,
          productName: name,
          unit,
          users: [],
        });
      }

      const productOrder = productMap.get(name);
      if (productOrder) {
        productOrder.users.push({
          image,
          userId,
          userName,
          quantity,
        });
      }
    }
  }

  return Array.from(productMap.values());
}

function SummarizeUserProducts({ dailyOrders }: { dailyOrders: CalendarOrdersType[] }) {
  const productOrders = groupOrdersByProduct(dailyOrders);
  return (
    <div className="space-y-6">
      <h2 className="text-base">Clients par produits</h2>
      {productOrders.map((product) => (
        <div key={product.productId} className="space-y-2">
          <h3 className="flex items-center gap-2">
            <DisplayProductIcon name={product.productName} />
            <p className={"text-sm font-medium underline underline-offset-2"}>{product.productName}</p>
          </h3>
          <ul className="space-y-2">
            {product.users.map((user) => (
              <li key={user.userId} className="grid grid-cols-8  items-center w-full">
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
