"use client";
import { extractProductQuantities } from "@/components/google-events/get-orders-for-events";
import { getUnitLabel } from "@/components/product/product-function";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, IconButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { dateFormatter, getLocalIsoString } from "@/lib/date-utils";
import { formatFrenchPhoneNumber } from "@/lib/utils";
import { addDays, addHours } from "date-fns";
import ky from "ky";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import type getDailyOrders from "../_actions/get-daily-orders";
import type { getGroupedAMAPOrders } from "../_functions/get-amap-orders";
import type { CalendarOrdersType } from "../_functions/get-orders";
import TodayFocus from "./date-focus";
import DisplayAmap from "./display-amap";
import DisplayOrder from "./display-order";
import SummarizeProducts from "./summarize-products";
import UpdatePage from "./update-page";
import { ListOrdered } from "lucide-react";
import OrdersModal from "./orders-modal";

type EventsPageProps = {
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  initialOrders: CalendarOrdersType[];
  dateArray: string[];
};

export default function EventPage({ amapOrders, initialOrders, dateArray }: EventsPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDateRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<CalendarOrdersType["user"]>();
  const [odrerIds, setOrderIds] = useState<string[]>();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [focusDate, setFocusDate] = useState(getLocalIsoString(new Date()));

  // Extract the initial focus date from search parameters or default to today

  // Handle Initial Scroll to Center the Focus Date
  useLayoutEffect(() => {
    function scrollToCurrentDate() {
      if (containerRef.current && currentDateRef.current && focusDate) {
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
    }

    scrollToCurrentDate();
  }, [focusDate]); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div
        ref={containerRef}
        className="flex flex-row gap-4 w-full overflow-x-scroll overflow-y-hidden mx-auto flex-auto"
      >
        {dateArray.map((date) => {
          const isFocused = date === focusDate;
          const initialData = initialOrders
            .filter((order) => getLocalIsoString(order.shippingDate) === date)
            .sort((a, b) => {
              if (a.index === null) return -1;
              if (b.index === null) return 1;
              return (a.index ?? 0) - (b.index ?? 0);
            });
          return (
            <div
              ref={isFocused ? currentDateRef : null}
              key={date}
              className="flex-shrink-0  w-full max-w-xs h-full space-y-2 relative"
            >
              <h2 className="text-xl font-semibold capitalize text-center flex justify-between items-center px-2">
                <span>{dateFormatter(new Date(date), { days: true })}</span>
                {initialData.length > 0 && (
                  <IconButton
                    Icon={ListOrdered}
                    iconClassName="size-3"
                    onClick={() => {
                      setOrderIds(initialData.map((order) => order.id));
                      setIsOrdersModalOpen(true);
                    }}
                    className=""
                  />
                )}
              </h2>

              <DatePage
                date={date}
                dailyOrders={initialData}
                allOrders={initialOrders}
                amapOrders={amapOrders}
                setUser={setUser}
                setIsModalOpen={setIsUserModalOpen}
              />
            </div>
          );
        })}
      </div>{" "}
      <div className="flex justify-between p-4 ">
        <UpdatePage />
        <TodayFocus
          startMonth={new Date(dateArray[0])}
          endMonth={new Date(dateArray[dateArray.length - 1])}
          setFocusDate={setFocusDate}
        />
      </div>
      <UserModal open={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} user={user} />
      <OrdersModal
        open={isOrdersModalOpen}
        onClose={() => {
          setIsOrdersModalOpen(false);
          // router.refresh();
        }}
        orderIds={odrerIds}
        allOrders={initialOrders}
      />
    </>
  );
}

async function fetchDailyOrders(date: string) {
  const from = new Date(date);
  const to = addHours(from, 24);
  console.log({ from, to });
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
  setUser,
  setIsModalOpen,
}: {
  date: string;
  dailyOrders: CalendarOrdersType[];
  allOrders: CalendarOrdersType[];
  amapOrders: Awaited<ReturnType<typeof getGroupedAMAPOrders>>;
  setUser: Dispatch<SetStateAction<CalendarOrdersType["user"] | undefined>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // const {
  //   data: dailyOrders,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryFn: async () => await fetchDailyOrders(date),
  //   queryKey: ["fetchDailyOrders", { date }],
  //   staleTime: 10 * 60,
  //   initialData,
  // });
  // if (error) {
  //   return <div>{error.message}</div>;
  // }

  // if (!dailyOrders) {
  //   return <div>No data</div>;
  // }

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
            return (
              <DisplayOrder
                key={order.id}
                order={order}
                newOrder={newOrder}
                onOpenModal={() => {
                  setUser(order.user);
                  setIsModalOpen(true);
                }}
              />
            );
          })
        )}
      </ul>
    </>
  );
}

function UserModal({ open, onClose, user }: { open: boolean; onClose: () => void; user?: CalendarOrdersType["user"] }) {
  const router = useRouter();
  return (
    <Modal title="Information du client" isOpen={open} onClose={onClose}>
      {user ? (
        <>
          <UserInfo user={user} />
          <div className="flex justify-between gap-4">
            <Button variant={"outline"} className="w-full" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant={"green"}
              className="w-full"
              onClick={() => {
                onClose();
                router.push(`/admin/users/${user.id}`);
              }}
            >
              Consulter
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>Aucun client sélectionné</p>
          <Button variant={"outline"} className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </>
      )}
    </Modal>
  );
}

const UserInfo = ({ user }: { user: CalendarOrdersType["user"] }) => (
  <div className="px-4 py-5 ">
    <div className="flex items-center mb-4 gap-4">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name || "Unknown User"}
          width={48}
          height={48}
          className="rounded-sm object-contain"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 font-semibold text-xs">{user.name?.charAt(0)}</span>
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold">{user.company || user.name || "Unknown User"}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        {!!user.phone && <p>{formatFrenchPhoneNumber(user.phone)}</p>}
      </div>
    </div>
    <div className="max-h-[40dvh] overflow-y-auto px-4">
      {user.company ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Nom</h3>

          <p className="mt-1 text-sm text-gray-900">{user.name}</p>
        </div>
      ) : null}
      {user.address ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
          <Button asChild variant={"link"} className="mt-1 text-sm p-0 text-blue-700">
            <Link href={`https://maps.google.com/?q=${user.address} ${user.company} `} target="_blank">
              {user.address}
            </Link>
          </Button>
        </div>
      ) : null}
      {user.notes ? (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Notes</h3>

          <AutosizeTextarea className="border-0 focus-visible:ring-0 select-text" readOnly value={user.notes} />
        </div>
      ) : null}
    </div>
  </div>
);
