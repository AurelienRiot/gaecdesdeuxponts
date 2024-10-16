"use client";
import { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { getUnitLabel } from "@/components/product/product-function";
import { IconButton } from "@/components/ui/button";
import NoResults from "@/components/ui/no-results";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { addDays, addHours } from "date-fns";
import ky from "ky";
import { ListOrdered } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import type getDailyOrders from "../_actions/get-daily-orders";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import type { CalendarOrdersType } from "../_functions/get-orders";
import TodayFocus from "./date-focus";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import OrdersModal from "./orders-modal";
import SummarizeProducts from "./summarize-products";
import UpdatePage from "./update-page";

type EventsPageProps = {
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  initialOrders: CalendarOrdersType[];
  initialDateArray: string[];
};

function scrollToElement(id: string, behavior: "smooth" | "instant" = "smooth") {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior, // or 'auto'
      block: "nearest", // 'start', 'center', 'end', or 'nearest'
      inline: "center", // 'start', 'center', 'end', or 'nearest'
    });
  } else {
    console.warn(`Element with id '${id}' not found inside the container.`);
  }
}

export default function EventPage({ amapOrders, initialOrders, initialDateArray: dateArray }: EventsPageProps) {
  const [odrerIds, setOrderIds] = useState<string[]>();

  // Handle Initial Scroll to Center the Focus Date
  useLayoutEffect(() => {
    scrollToElement(getLocalIsoString(new Date()), "instant");
  }, []);

  // const onEnterViewport = useCallback((index: number) => {
  //   const numberDates = 1;
  //   const dateWidth = numberDates * (320 + 16);
  //   const container = containerRef.current;
  //   if (!container) return;
  //   if (index === 0) {
  //     console.log("onEnterViewport first");

  //     setDateArray((prevDateArray) => {
  //       const newDates = Array.from(
  //         { length: numberDates },
  //         (_, i) =>
  //           subDays(new Date(prevDateArray[0]), i + 1)
  //             .toISOString()
  //             .split("T")[0],
  //       ).reverse();
  //       return [...newDates, ...prevDateArray.slice(0, -numberDates)]; // Keep the last dates
  //     });
  //     requestAnimationFrame(() => {
  //       container.scrollLeft *= dateWidth;
  //     });
  //   }
  //   if (index === 9) {
  //     console.log("onEnterViewport last");
  //     setDateArray((prevDateArray) => {
  //       const newLastDates = Array.from(
  //         { length: numberDates },
  //         (_, i) =>
  //           addDays(new Date(prevDateArray[prevDateArray.length - 1]), i + 1)
  //             .toISOString()
  //             .split("T")[0],
  //       );
  //       return [...prevDateArray.slice(numberDates), ...newLastDates]; // Remove the first four elements and add new last dates
  //     });
  //     requestAnimationFrame(() => {
  //       container.scrollLeft -= dateWidth;
  //     });
  //   }
  // }, []);

  return (
    <>
      <div className="flex flex-row gap-4 w-full overflow-x-scroll overflow-y-hidden mx-auto flex-auto pb-4 ">
        {dateArray.map((date, index) => {
          const dailyOrders = initialOrders
            .filter((order) => getLocalIsoString(order.shippingDate) === date)
            .sort((a, b) => {
              if (a.index === null) return -1;
              if (b.index === null) return 1;
              return (a.index ?? 0) - (b.index ?? 0);
            });
          return (
            <RenderEvent
              date={date}
              initialOrders={initialOrders}
              amapOrders={amapOrders}
              dailyOrders={dailyOrders}
              key={date}
            />
          );
        })}
      </div>
      <div className="flex justify-between p-4 ">
        <UpdatePage />
        <TodayFocus
          startMonth={new Date(dateArray[0])}
          endMonth={new Date(dateArray[dateArray.length - 1])}
          onDayClick={scrollToElement}
        />
      </div>
    </>
  );
}

function RenderEvent({
  dailyOrders,
  date,
  initialOrders,
  amapOrders,
}: {
  dailyOrders: CalendarOrdersType[];
  initialOrders: CalendarOrdersType[];
  date: string;
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
}) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  return (
    <div key={date} id={date} className="flex-shrink-0  w-[320px] h-full space-y-2 relative">
      <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center px-2">
        <span>{dateFormatter(new Date(date), { days: true })}</span>
        {dailyOrders.length > 0 && (
          <>
            <OrdersModal
              open={isOrderModalOpen}
              onClose={() => {
                setIsOrderModalOpen(false);
              }}
              initialOrders={dailyOrders}
            />
            <IconButton
              Icon={ListOrdered}
              iconClassName="size-3"
              onClick={() => {
                setIsOrderModalOpen(true);
              }}
              className=""
            />
          </>
        )}
      </h2>

      <DatePage date={date} dailyOrders={dailyOrders} allOrders={initialOrders} amapOrders={amapOrders} />
    </div>
  );
}

async function fetchDailyOrders(date: string) {
  const from = new Date(date);
  const to = addHours(from, 24);
  const responce = (await ky.post("/api/get-day-orders", { json: { from, to } }).json()) as Awaited<
    ReturnType<typeof getDailyOrders>
  >;
  // const responce = await getDailyOrders({ from, to });
  if (!responce.success) {
    throw new Error(responce.message);
  }
  if (!responce.data) {
    throw new Error("Impossible de charger les commandes");
  }
  for (const order of responce.data) {
    order.createdAt = new Date(order.createdAt);
    order.shippingDate = new Date(order.shippingDate);
  }
  return responce.data;
}

function DatePage({
  date,
  amapOrders,
  dailyOrders,
  allOrders,
}: {
  date: string;
  dailyOrders: CalendarOrdersType[];
  allOrders: CalendarOrdersType[];
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
}) {
  // const {
  //   data: dailyOrders,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryFn: async () => await fetchDailyOrders(date),
  //   queryKey: ["fetchDailyOrders", { date }],
  //   staleTime: 10 * 60,
  //   // initialData,
  // });
  // if (error) {
  //   return <div>{error.message}</div>;
  // }
  // console.log(isLoading);
  // if (isLoading) {
  //   <Spinner className="size-6" />;
  // }

  if (!dailyOrders) {
    return <NoResults />;
  }

  const amapData = amapOrders.map((order) => ({
    shopName: order.shopName,
    shopImageUrl: order.shopImageUrl,
    order: order.shippingDays.find((shippingDay) => getLocalIsoString(new Date(shippingDay.date)) === date),
  }));
  // const orderData = dailyOrders
  //   .sort((a, b) => {
  //     if (a.status === "Commande livrée") return 1;
  //     return -1;
  //   });

  const productQuantities = extractProductQuantities(
    dailyOrders
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
              quantity: item.quantity,
              unit: item.unit,
            })) || [],
        ),
      ),
  );

  return (
    <>
      {/* {isLoading && <Spinner size={20} className="absolute -top-0 right-0" />} */}
      <ul className="space-y-4 overflow-y-auto h-full relative" style={{ height: `calc(100% - 36px)` }}>
        {productQuantities.aggregateProducts.length > 0 && <SummarizeProducts productQuantities={productQuantities} />}
        <DisplayAmap amapOrders={amapData} />
        {dailyOrders.length === 0 ? (
          <p className="text-center">Aucune commande</p>
        ) : (
          dailyOrders.map((order, index) => {
            const newOrder = allOrders.some((nextOrder) => {
              return (
                nextOrder.user.id === order.user.id &&
                addDays(new Date(date), 1).getTime() < nextOrder.shippingDate.getTime()
              );
            });
            return <DisplayOrder key={order.id} order={order} newOrder={newOrder} />;
          })
        )}
      </ul>
    </>
  );
}
