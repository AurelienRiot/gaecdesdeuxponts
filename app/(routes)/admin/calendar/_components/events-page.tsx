"use client";
import Spinner from "@/components/animations/spinner";
import { IconButton } from "@/components/ui/button";
import NoResults from "@/components/ui/no-results";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";
import { ListOrdered } from "lucide-react";
import { useCallback, useRef } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import type { CalendarOrdersType } from "../_functions/get-orders";
import TodayFocus from "./date-focus";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import { useOrdersModal } from "./orders-modal";
import { useOrdersQuery } from "./orders-query";
import SummarizeProducts from "./summarize-products";
import UpdatePage from "./update-page";

type EventsPageProps = {
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  initialDateArray: string[];
};

export default function EventPage({ amapOrders, initialDateArray: dateArray }: EventsPageProps) {
  const { data: allOrders, error, fetchStatus } = useOrdersQuery(dateArray);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const scrollToElement = useCallback(
    (id: string, behavior: "smooth" | "auto" = "smooth") => {
      const index = dateArray.findIndex((date) => date === id);

      const element = virtuosoRef.current;
      if (element) {
        element.scrollIntoView({
          index,
          behavior,
          align: "center",
        });
      } else {
        console.warn(`Element with id '${id}' not found inside the container.`);
      }
    },
    [dateArray],
  );
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

      {/* {allOrders && ( */}
      <Virtuoso
        ref={virtuosoRef}
        initialTopMostItemIndex={dateArray.findIndex((date) => date === getLocalIsoString(new Date()))}
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
              className="mx-4 pb-6 
              
              "
            />
          );
        }}
        className="flex flex-row  overflow-y-hidden mx-auto  flex-auto w-full overflow-x-scroll relative "
      />
      {/* )} */}
      {/* <div className="flex flex-row gap-4  pb-6 overflow-y-hidden mx-auto flex-auto w-full overflow-x-scroll">
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
      </div> */}
      <div className="flex justify-between p-4 max-w-[500px] mx-auto w-full">
        <UpdatePage />
        <TodayFocus
          startMonth={new Date(dateArray[0])}
          endMonth={new Date(dateArray[dateArray.length - 1])}
          scrollToElement={scrollToElement}
        />
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
    <div key={date} id={date} className={cn(" w-[320px] h-full  space-y-2 relative ", className)}>
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
    <ul className="space-y-4 overflow-y-auto h-full absolute left-0 top-10" style={{ height: `calc(100% - 50px)` }}>
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
            return otherOrder.user.id === order.user.id;
          });
          return <DisplayOrder key={order.id} order={order} newOrder={newOrder} otherOrders={otherOrders} />;
        })
      )}
    </ul>
  );
}
