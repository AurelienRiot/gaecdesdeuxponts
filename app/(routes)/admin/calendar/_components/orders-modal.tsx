"use client";
import { createDirectionUrl } from "@/components/google-events";
import { FaMapLocationDot } from "@/components/react-icons";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import Link from "next/link";
import { createContext, memo, useContext, useEffect, useState } from "react";
import updateOrdersIndex from "../_actions/update-orders-index";
import type { CalendarOrdersType } from "../_functions/get-orders";
import { useOrdersQueryClient } from "./orders-query";

type OrdersModalContextType = {
  orders: CalendarOrdersType[] | null;
  setOrders: React.Dispatch<React.SetStateAction<CalendarOrdersType[] | null>>;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OrdersModalContext = createContext<OrdersModalContextType | undefined>(undefined);

export const OrdersModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [orders, setOrders] = useState<CalendarOrdersType[] | null>(null);
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
  const { refectOrders } = useOrdersQueryClient();
  const [localOrders, setLocalOrders] = useState(orders);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  function closeModal() {
    setIsOrderModalOpen(false);
    if (!localOrders) return;
    function onSuccess() {
      refectOrders();
    }
    const newOrders = localOrders.map((order, index) => ({ orderId: order.id, index: index + 1 }));
    serverAction({ data: newOrders, onSuccess });
  }

  return (
    <Modal title="Ordonner les commandes" isOpen={isOrderModalOpen} onClose={closeModal}>
      <ReorderItem orders={localOrders} setOrders={setLocalOrders} />
    </Modal>
  );
}

export default OrdersModal;

function ReorderItem({
  orders,
  setOrders,
}: {
  orders: CalendarOrdersType[] | null;
  setOrders: React.Dispatch<React.SetStateAction<CalendarOrdersType[] | null>>;
}) {
  if (!orders) return <NoResults />;
  const directionString = createDirectionUrl({
    addresses: orders.map((order) => order.address.label),
  });

  return (
    <ScrollArea className=" max-h-[70dvh] overflow-auto p-2">
      <Link
        href={directionString}
        target="_blank"
        className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200 mb-2"
      >
        <FaMapLocationDot className="h-5 w-5 mr-3" />
        Accéder au trajet
      </Link>
      <Reorder.Group
        as="ul"
        values={orders}
        onReorder={setOrders}
        className="flex flex-col gap-2   relative"
        axis="y"
        layoutScroll
      >
        {orders.map((order, index) => (
          <MemoizedOrderItem key={order.id} order={order} />
        ))}
      </Reorder.Group>
    </ScrollArea>
  );
}

const MemoizedOrderItem = memo(OrderItem);

function OrderItem({ order }: { order: CalendarOrdersType }) {
  // const y = useMotionValue(0);
  // const boxShadow = useRaisedShadow(y);
  const controls = useDragControls();
  const backgroundColor = useMotionValue("var(--background)");

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    controls.start(e);
    backgroundColor.set("var(--blue-300)");
  };

  return (
    <Reorder.Item
      // style={{ boxShadow, y }}
      value={order}
      id={order.id}
      dragListener={false}
      dragControls={controls}
      onDragEnd={() => {
        backgroundColor.set("var(--background)");
      }}
      as="li"
      style={{ backgroundColor }}
      className={`p-2 border rounded-md flex gap-2 transition-colors`}
    >
      <div onPointerDown={handlePointerDown} className="flex gap-2 items-center justify-center p-2 cursor-pointer">
        <Grip className="size-4" />
      </div>
      <NameWithImage
        name={order.name}
        image={order.user.image}
        imageSize={12}
        className="p-2 select-none pointer-events-none"
      />
    </Reorder.Item>
  );
}
