"use client";
import type { OrderCardProps } from "@/components/display-orders/order-card";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";

type EventsPageProps = {
  orders: OrderCardProps[];
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  dateArray: string[];
};

export default function EventPage({ amapOrders, dateArray, orders }: EventsPageProps) {
  const searchParams = useSearchParams();
  const focusDate = searchParams.get("day") || getLocalIsoString(new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  const currentDateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && currentDateRef.current) {
      const container = containerRef.current;
      const currentDateElement = currentDateRef.current;

      const containerWidth = container.clientWidth;
      const elementOffsetLeft = currentDateElement.offsetLeft;
      const elementWidth = currentDateElement.clientWidth;

      // Calculate the position to scroll so that the current date is centered
      const scrollPosition = elementOffsetLeft - containerWidth / 2 + elementWidth / 2;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth", // Optional: adds smooth scrolling
      });
    }
  }, [focusDate]);

  return (
    <div ref={containerRef} className="flex flex-row gap-4  w-full overflow-x-scroll mx-auto">
      {dateArray.map((date) => {
        const isFocused = date === focusDate;

        const amapData = amapOrders.map((order) => ({
          shopName: order.shopName,
          shopImageUrl: order.shopImageUrl,
          order: order.shippingDays.find((shippingDay) => getLocalIsoString(new Date(shippingDay.date)) === date),
        }));
        const orderData = orders.filter((order) => getLocalIsoString(order.shippingDate) === date);
        return (
          <div
            ref={isFocused ? currentDateRef : null}
            key={date}
            className="flex-shrink-0 w-full max-w-xs h-full space-2"
          >
            <h2 className="text-xl font-semibold">{dateFormatter(new Date(date), { days: true })}</h2>
            <ul className="  space-y-4 overflow-y-auto h-full" style={{ height: `calc(100% - 28px)` }}>
              <DisplayAmap amapOrders={amapData} />
              {orderData.length === 0 ? (
                <p>Aucune commande</p>
              ) : (
                orderData.map((order) => <DisplayOrder key={order.id} order={order} />)
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
