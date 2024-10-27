"use client";
import Spinner from "@/components/animations/spinner";
import { IconButton } from "@/components/ui/button";
import NoResults from "@/components/ui/no-results";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";
import { ListOrdered } from "lucide-react";
import { useLayoutEffect } from "react";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import { useOrdersModal } from "./orders-modal";
import { useOrdersQuery } from "./orders-query";
import SummarizeProducts from "./summarize-products";

type EventsPageProps = {
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  initialDateArray: string[];
};

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
  const { data: allOrders, error, fetchStatus } = useOrdersQuery(dateArray);

  useLayoutEffect(() => {
    scrollToElement(getLocalIsoString(new Date()), "instant");
  }, []);
  return (
    <>
      {fetchStatus === "fetching" && (
        <div className="absolute left-1/2 translate-x-[-40%]    bottom-7 h-2 max-w-[200px]  w-[40%] overflow-hidden rounded border-2 bg-primary-foreground">
          <div className="absolute h-full animate-load-bar rounded bg-primary"></div>
          <div
            style={{ animationDelay: `500ms` }}
            className="absolute h-full animate-load-bar rounded bg-primary"
          ></div>
        </div>
      )}
      {fetchStatus === "paused" && (
        <div className="absolute left-1/2 translate-x-[-35%]  text-destructive font-bold  bottom-6    overflow-hidden ">
          Aucune connection
        </div>
      )}
      {error && (
        <div
          className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[500px] pl-28 pr-20
            text-center  text-destructive font-bold  bottom-10 "
        >
          {error.message}
        </div>
      )}
      {/* <div style={{ width: "100vw", height: "100%" }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              layout="horizontal"
              width={width}
              height={height}
              itemSize={352}
              itemCount={dateArray.length}
            >
              {({ index, style }) => {
                const date = dateArray[index];
                const dailyOrders = allOrders
                  ?.filter((order) => getLocalIsoString(order.shippingDate) === date)
                  .sort((a, b) => {
                    if (a.index === null) return -1;
                    if (b.index === null) return 1;
                    return (a.index ?? 0) - (b.index ?? 0);
                  });
                return (
                  <div style={style}>
                    <RenderEvent
                      date={date}
                      allOrders={allOrders}
                      amapOrders={amapOrders}
                      dailyOrders={dailyOrders}
                      key={date}
                    />
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div> */}
      {/* <Virtuoso
        data={dateArray}
        horizontalDirection
        itemContent={(_, date) => {
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
              className="mx-4 pb-6 h-full [[data-index]_&]:relative  absolute inset-0"
            />
          );
        }}
        className="flex flex-row  overflow-y-hidden mx-auto  flex-auto w-full overflow-x-scroll relative "
      /> */}

      <div className="flex flex-row gap-4  pb-6 overflow-y-hidden mx-auto flex-auto w-full overflow-x-scroll">
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
  className,
}: {
  dailyOrders?: CalendarOrdersType[];
  allOrders?: CalendarOrdersType[];
  date: string;
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  className?: string;
}) {
  return (
    <div key={date} id={date} className={cn("flex-shrink-0  w-[320px] h-full space-y-2 ", className)}>
      <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center p-2 z-50">
        <span>{dateFormatter(new Date(date), { days: true })}</span>
        {dailyOrders && dailyOrders.length > 0 && <IconReorder dailyOrders={dailyOrders} />}
      </h2>

      {dailyOrders && allOrders ? (
        <DatePage date={date} dailyOrders={dailyOrders} allOrders={allOrders} amapOrders={amapOrders} />
      ) : (
        <Spinner className="size-6" />
      )}
    </div>
  );
}

function IconReorder({ dailyOrders }: { dailyOrders: CalendarOrdersType[] }) {
  const { setOrders, setIsOrderModalOpen } = useOrdersModal();

  return (
    <IconButton
      Icon={ListOrdered}
      iconClassName="size-3"
      onClick={() => {
        setOrders(dailyOrders);
        setIsOrderModalOpen(true);
      }}
      className=""
    />
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
      <ul className="space-y-4 overflow-y-auto h-full relative" style={{ height: `calc(100% - 36px)` }}>
        <SummarizeProducts dailyOrders={dailyOrders} amapOrders={amapData} />
        <DisplayAmap amapOrders={amapData} />
        {dailyOrders.length === 0 ? (
          <p className="text-center w-full max-w-sm">Aucune commande</p>
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
                otherOrder.user.id === order.user.id
                //  && otherOrder.shippingDate.getTime() <= addDays(new Date(date), 1).getTime()
              );
            });
            return <DisplayOrder key={order.id} order={order} newOrder={newOrder} otherOrders={otherOrders} />;
          })
        )}
      </ul>
    </>
  );
}
