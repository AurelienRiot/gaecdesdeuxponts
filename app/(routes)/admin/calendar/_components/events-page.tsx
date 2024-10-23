"use client";
import Spinner from "@/components/animations/spinner";
import { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { getUnitLabel } from "@/components/product/product-function";
import { IconButton } from "@/components/ui/button";
import NoResults from "@/components/ui/no-results";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { ListOrdered } from "lucide-react";
import { useLayoutEffect } from "react";
import getDailyOrders from "../_actions/get-daily-orders";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import { useOrdersModal } from "./orders-modal";
import SummarizeProducts from "./summarize-products";
import { addDelay } from "@/lib/utils";

type EventsPageProps = {
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  initialDateArray: string[];
};

async function fetchOrders(dateArray: string[]) {
  const from = new Date(dateArray[0]);
  const to = new Date(dateArray[dateArray.length - 1]);
  const responce = await getDailyOrders({ from, to });
  // const responce = (await ky.post("/api/get-day-orders", { json: { from, to } }).json()) as Awaited<
  //   ReturnType<typeof getDailyOrders>
  // >;
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

export function scrollToElement(id: string, behavior: "smooth" | "instant" = "smooth") {
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

export default function EventPage({ amapOrders, initialDateArray: dateArray }: EventsPageProps) {
  const {
    data: allOrders,
    isFetching,
    error,
  } = useQuery({
    queryFn: async () => await fetchOrders(dateArray),
    queryKey: ["fetchOrders"],
    staleTime: 60 * 60 * 1000,
  });

  useLayoutEffect(() => {
    scrollToElement(getLocalIsoString(new Date()), "instant");
  }, []);
  return (
    <>
      <div className="flex flex-row gap-4  pb-4 overflow-y-hidden mx-auto flex-auto w-full overflow-x-scroll">
        {isFetching && <Spinner className="absolute top-1/2 left-1/2 text-primary/50" />}
        {dateArray.map((date, index) => {
          const dailyOrders = allOrders
            ?.filter((order) => getLocalIsoString(order.shippingDate) === date)
            .sort((a, b) => {
              if (a.index === null) return -1;
              if (b.index === null) return 1;
              return (a.index ?? 0) - (b.index ?? 0);
            });
          return (
            <RenderEvent
              date={date}
              allOrders={allOrders}
              amapOrders={amapOrders}
              dailyOrders={dailyOrders}
              key={date}
            />
          );
        })}
      </div>
    </>
  );
}

function RenderEvent({
  dailyOrders,
  date,
  allOrders,
  amapOrders,
}: {
  dailyOrders?: CalendarOrdersType[];
  allOrders?: CalendarOrdersType[];
  date: string;
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
}) {
  const { setOrders, setIsOrderModalOpen } = useOrdersModal();
  return (
    <div key={date} id={date} className="flex-shrink-0  w-[320px] h-full space-y-2 relative ">
      <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center p-2 z-50">
        <span>{dateFormatter(new Date(date), { days: true })}</span>
        {dailyOrders && dailyOrders.length > 0 && (
          <>
            <IconButton
              Icon={ListOrdered}
              iconClassName="size-3"
              onClick={() => {
                setOrders(dailyOrders);
                setIsOrderModalOpen(true);
              }}
              className=""
            />
          </>
        )}
      </h2>

      {dailyOrders && allOrders ? (
        <DatePage date={date} dailyOrders={dailyOrders} allOrders={allOrders} amapOrders={amapOrders} />
      ) : (
        <Spinner className="size-6" />
      )}
    </div>
  );
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
  if (!dailyOrders) {
    return <NoResults />;
  }

  const amapData = amapOrders.map((order) => ({
    shopName: order.shopName,
    shopImageUrl: order.shopImageUrl,
    order: order.shippingDays.find((shippingDay) => getLocalIsoString(new Date(shippingDay.date)) === date),
  }));

  return (
    <>
      {/* {isLoading && <Spinner size={20} className="absolute -top-0 right-0" />} */}
      <ul className="space-y-4 overflow-y-auto h-full relative" style={{ height: `calc(100% - 36px)` }}>
        <SummarizeProducts dailyOrders={dailyOrders} amapOrders={amapData} />
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
            const otherOrders = allOrders.filter((otherOrder) => {
              return (
                otherOrder.user.id === order.user.id && otherOrder.shippingDate.getTime() <= new Date(date).getTime()
              );
            });
            return <DisplayOrder key={order.id} order={order} newOrder={newOrder} otherOrders={otherOrders} />;
          })
        )}
      </ul>
    </>
  );
}
