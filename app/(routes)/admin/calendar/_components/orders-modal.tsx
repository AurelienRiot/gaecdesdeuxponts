"use client";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { NameWithImage } from "@/components/user";
import type { CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import { useOrdersQueryClient } from "@/hooks/use-query/orders-query";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { createContext, memo, useContext, useEffect, useState } from "react";
import updateOrdersIndex from "../_actions/update-orders-index";
import { useRaisedShadow } from "./use-raised-shadow";

type OrdersModalContextType = {
  orders: CalendarOrderType[] | null;
  setOrders: React.Dispatch<React.SetStateAction<CalendarOrderType[] | null>>;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OrdersModalContext = createContext<OrdersModalContextType | undefined>(undefined);

export const OrdersModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [orders, setOrders] = useState<CalendarOrderType[] | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <OrdersModalContext.Provider value={{ orders, setOrders, isOrderModalOpen, setIsOrderModalOpen }}>
      {children}
      <OrdersModal />
    </OrdersModalContext.Provider>
  );
};

export function useOrdersModal() {
  const context = useContext(OrdersModalContext);

  if (context === undefined) {
    throw new Error("useOrdersModal must be used within a OrdersModalProvider");
  }

  return context;
}

function OrdersModal() {
  const { serverAction } = useServerAction(updateOrdersIndex);
  const { orders, isOrderModalOpen, setIsOrderModalOpen } = useOrdersModal();
  const { mutateOrders } = useOrdersQueryClient();
  const [localOrders, setLocalOrders] = useState(orders?.map(({ id }) => id));

  useEffect(() => {
    setLocalOrders(orders?.map(({ id }) => id));
  }, [orders]);

  function closeModal() {
    setIsOrderModalOpen(false);

    if (!localOrders) return;
    const newOrders = localOrders.map((orderId, index) => ({ orderId, index: index + 1 }));

    serverAction({ data: newOrders });
    mutateOrders((prev) =>
      prev.map((order) => {
        const newOrder = newOrders.find((o) => o.orderId === order.id);
        if (newOrder) {
          return { ...order, index: newOrder.index };
        }
        return order;
      }),
    );
  }

  return (
    <Modal title="Ordonner les commandes" isOpen={isOrderModalOpen} onClose={closeModal}>
      <ReorderItem localOrders={localOrders} orders={orders} setLocalOrders={setLocalOrders} />
    </Modal>
  );
}

export default OrdersModal;

function ReorderItem({
  orders,
  localOrders,
  setLocalOrders,
}: {
  orders: CalendarOrderType[] | null;
  localOrders?: string[];
  setLocalOrders: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  if (!localOrders) return <NoResults />;
  // const directionString = createDirectionUrl({
  //   addresses: orders.map((order) => order.address.label),
  // });

  return (
    <>
      {/* <Link
        href={directionString}
        target="_blank"
        className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 mb-2"
        >
        <FaMapLocationDot className="h-5 w-5 mr-3" />
        Accéder au trajet
        </Link> */}
      <Reorder.Group
        as="ul"
        values={localOrders}
        onReorder={setLocalOrders}
        className="flex flex-col gap-2   relative max-h-[70dvh] p-2"
        style={{ overflowY: "scroll" }}
        axis="y"
        layoutScroll
      >
        {localOrders.map((orderId, index) => {
          const order = orders?.find((o) => o.id === orderId);
          if (!order) return null;
          return <MemoizedOrderItem key={order.id} order={order} />;
        })}
      </Reorder.Group>
    </>
  );
}

const MemoizedOrderItem = memo(OrderItem);

function OrderItem({ order }: { order: CalendarOrderType }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  const controls = useDragControls();

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    controls.start(e);
  };

  return (
    <Reorder.Item
      style={{ boxShadow, y }}
      value={order.id}
      id={order.id}
      dragListener={false}
      dragControls={controls}
      as="li"
      className={`p-2 border rounded-md flex gap-2 transition-colors bg-background`}
    >
      <div
        onPointerDown={handlePointerDown}
        style={{ touchAction: "none" }}
        className="flex gap-2 items-center justify-center p-2 cursor-pointer"
      >
        <Grip className="size-4" />
      </div>
      <NameWithImage
        name={order.userName}
        image={order.userImage}
        imageSize={12}
        className="p-2 select-none pointer-events-none"
      />
    </Reorder.Item>
  );
}
