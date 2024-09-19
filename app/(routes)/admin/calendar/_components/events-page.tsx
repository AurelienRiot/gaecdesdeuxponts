"use client";
import type { OrderCardProps } from "@/components/display-orders/order-card";
import { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { getUnitLabel } from "@/components/product/product-function";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { debounce } from "@/lib/debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import TodayFocus from "./date-focus";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import SummarizeProducts from "./summarize-products";
import UpdatePage from "./update-page";

type EventsPageProps = {
  orders: OrderCardProps[];
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  dateArray: string[];
};

export default function EventPage({ amapOrders, dateArray, orders }: EventsPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialScrollRef = useRef<boolean>(false); // Tracks if initial scroll has been done
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDateRef = useRef<HTMLDivElement>(null);

  // Extract the initial focus date from search parameters or default to today
  const initialFocusDate = useRef<string>(searchParams.get("day") || getLocalIsoString(new Date()));

  // Handle Initial Scroll to Center the Focus Date
  useEffect(() => {
    if (containerRef.current && currentDateRef.current && !initialScrollRef.current) {
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

      initialScrollRef.current = true; // Mark that initial scroll has been performed
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Scroll Event Handler to Update 'day' Search Parameter
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestDate: string | null = null;
    let minDistance = Number.POSITIVE_INFINITY;

    dateArray.forEach((date, index) => {
      const child = container.children[index] as HTMLElement;
      if (child) {
        const childRect = child.getBoundingClientRect();
        const childCenter = childRect.left + childRect.width / 2;
        const distance = Math.abs(containerCenter - childCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestDate = date;
        }
      }
    });

    if (closestDate && closestDate !== initialFocusDate.current) {
      // Update the search parameter without triggering the initial scroll
      router.replace(`?day=${closestDate}`);
    }
  }, [dateArray, router]);

  // Debounced Scroll Handler to Optimize Performance
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 300), [handleScroll]);

  // Attach Scroll Event Listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      container.removeEventListener("scroll", debouncedHandleScroll);
      debouncedHandleScroll.cancel(); // Cancel any pending debounced calls on unmount
    };
  }, [debouncedHandleScroll]);

  return (
    <>
      <div ref={containerRef} className="flex flex-row gap-4 w-full overflow-x-scroll mx-auto flex-auto">
        {dateArray.map((date) => {
          const isFocused = date === initialFocusDate.current;

          const amapData = amapOrders.map((order) => ({
            shopName: order.shopName,
            shopImageUrl: order.shopImageUrl,
            order: order.shippingDays.find((shippingDay) => getLocalIsoString(new Date(shippingDay.date)) === date),
          }));
          const orderData = orders.filter((order) => getLocalIsoString(order.shippingDate) === date);

          const productQuantities = extractProductQuantities(
            orderData
              .flatMap((order) =>
                order.productsList.map((item) => ({
                  itemId: item.name,
                  name: item.name,
                  quantity: Number(item.quantity || 1),
                  unit: getUnitLabel(item.unit).quantity,
                })),
              )
              .concat(
                amapData.flatMap(
                  (shop) =>
                    shop.order?.items.map((item) => ({
                      itemId: item.itemId,
                      name: item.name,
                      quantity: item.totalQuantity,
                      unit: getUnitLabel(item.unit).quantity,
                    })) || [],
                ),
              ),
          );
          return (
            <div
              ref={isFocused ? currentDateRef : null}
              key={date}
              className="flex-shrink-0  w-full max-w-xs h-full space-y-2"
            >
              <h2 className="text-xl font-semibold capitalize text-center">
                {dateFormatter(new Date(date), { days: true })}
              </h2>
              <ul className="space-y-4 overflow-y-auto h-full" style={{ height: `calc(100% - 36px)` }}>
                {productQuantities.aggregateProducts.length > 0 && (
                  <SummarizeProducts productQuantities={productQuantities} />
                )}
                <DisplayAmap amapOrders={amapData} />
                {orderData.length === 0 ? (
                  <p className="text-center">Aucune commande</p>
                ) : (
                  orderData.map((order) => <DisplayOrder key={order.id} order={order} />)
                )}
              </ul>
            </div>
          );
        })}
      </div>{" "}
      <div className="flex justify-between p-4 ">
        <UpdatePage />
        <TodayFocus />
      </div>
    </>
  );
}
