import { AnimateHeight } from "@/components/animations/animate-size";
import {
  displayQuantity,
  extractProductQuantities,
  type GetAmapOrdersForTheDay,
  type GroupUsersByProduct,
} from "@/components/google-events";
import { DisplayProductIcon } from "@/components/product";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { nanoid } from "@/lib/id";
import { cn, numberFormat2Decimals } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayItem from "./display-item";

function SummarizeProducts({
  dailyOrders,
  amapOrders,
  className,
}: { dailyOrders: CalendarOrdersType[]; amapOrders: GetAmapOrdersForTheDay; className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [productQuantities, setProductQuantities] = useState(extractProductQuantities(dailyOrders, amapOrders));

  useEffect(() => {
    setProductQuantities(extractProductQuantities(dailyOrders, amapOrders));
  }, [dailyOrders, amapOrders]);

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
          <SummarizeUserProducts productQuantities={productQuantities} setProductQuantities={setProductQuantities} />
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

function SummarizeUserProducts({
  productQuantities,
  setProductQuantities,
}: {
  productQuantities: {
    aggregateProducts: GroupUsersByProduct[];
    totaleQuantity: {
      name: string;
      quantity: number;
      unit: string;
    }[];
  };
  setProductQuantities: Dispatch<
    SetStateAction<{
      aggregateProducts: GroupUsersByProduct[];
      totaleQuantity: {
        name: string;
        quantity: number;
        unit: string;
      }[];
    }>
  >;
}) {
  const handleClick = (productName: string, userName: string, deleted: boolean, oldName: string) => {
    const newUserName = deleted ? userName : `${userName}/deleted`;
    setProductQuantities((prev) => {
      return {
        ...prev,
        aggregateProducts: prev.aggregateProducts.map((aggProduct) => {
          if (aggProduct.productName === productName) {
            return {
              ...aggProduct,
              users: aggProduct.users.map((u) => {
                if (u.userName === oldName) {
                  return { ...u, userName: newUserName }; // Update the user name
                }
                return u; // Return unchanged user
              }),
            };
          }
          return aggProduct; // Return unchanged aggregate product
        }),
      };
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-base">Clients par produits</h2>
      {productQuantities.aggregateProducts.map((product) => {
        const totalQuantity = displayQuantity(
          product.productName,
          product.users.reduce((total, user) => (user.userName.includes("deleted") ? total : total + user.quantity), 0),
        );
        return (
          <div key={nanoid(5)} className="space-y-2">
            <h3 className="flex items-center gap-2">
              <DisplayProductIcon name={product.productName} />
              <p
                className={"text-sm font-medium underline underline-offset-2"}
              >{`${product.productName} (${totalQuantity}${product.unit})`}</p>
            </h3>
            <div className="space-y-2 ">
              {product.users.map((user) => {
                const deleted = user.userName.includes("deleted");
                const name = user.userName.split("/")[0];
                return (
                  <button
                    type="button"
                    onClick={() => handleClick(product.productName, name, deleted, user.userName)}
                    key={nanoid(5)}
                    className={cn(
                      "grid grid-cols-8  items-center w-full",
                      deleted && " line-through  decoration-destructive",
                    )}
                  >
                    <NameWithImage name={name} image={user.image} imageSize={8} className="col-span-7" />
                    <p className="col-span-1">
                      : {user.quantity}
                      {product.unit}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SummarizeProducts;
