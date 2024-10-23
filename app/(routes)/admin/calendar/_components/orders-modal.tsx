"use client";
import { createDirectionUrl } from "@/components/google-events";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, memo, useContext, useState } from "react";
import updateOrdersIndex from "../_actions/update-orders-index";
import type { CalendarOrdersType } from "../_functions/get-orders";
import { useRaisedShadow } from "./use-raised-shadow";
import { FaMapLocationDot } from "@/components/react-icons";

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
  const router = useRouter();

  function closeModal() {
    setIsOrderModalOpen(false);
    if (!orders) return;
    function onSuccess() {
      router.refresh();
    }
    const newOrders = orders.map((order, index) => ({ orderId: order.id, index: index + 1 }));
    serverAction({ data: newOrders, onSuccess });
  }

  return (
    <Modal title="Ordonner les commandes" isOpen={isOrderModalOpen} onClose={closeModal}>
      <ReorderItem />
    </Modal>
  );
}

export default OrdersModal;

function ReorderItem() {
  const { orders, setOrders } = useOrdersModal();
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
        // ref={listRef}
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
      value={order}
      id={order.id}
      dragListener={false}
      dragControls={controls}
      as="li"
      className="p-2  border rounded-md  flex gap-2 bg-background hover:bg-background/50"
    >
      <div onPointerDown={handlePointerDown} className="flex gap-2 items-center justify-center p-2 cursor-pointer">
        <Grip className="size-4" />
      </div>
      <NameWithImage name={order.name} image={order.user.image} imageSize={12} className="p-2" />
    </Reorder.Item>
  );
}
