import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { useEffect, useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import { useRaisedShadow } from "./use-raised-shadow";
import updateOrdersIndex from "../_actions/update-orders-index";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";
import getOrdersIndex from "../_actions/get-orders-index";
import { addDays } from "date-fns";
import Spinner from "@/components/animations/spinner";

function OrdersModal({
  open,
  onClose,
  orderIds,
  allOrders,
}: {
  open: boolean;
  onClose: () => void;
  orderIds?: string[];
  allOrders: CalendarOrdersType[];
}) {
  const [orders, setOrders] = useState<CalendarOrdersType[]>();
  const { serverAction } = useServerAction(updateOrdersIndex);
  const { serverAction: getOrdersIndexAction, loading } = useServerAction(getOrdersIndex);
  const router = useRouter();
  // const listRef = useRef<HTMLUListElement>(null);
  // const pointerY = useRef<number | undefined>(undefined);
  // const [isDragging, setIsDragging] = useState(false);

  // useEffect(() => {
  //   const handlePointerMove = (e: PointerEvent) => {
  //     pointerY.current = e.clientY;
  //   };

  //   window.addEventListener("pointermove", handlePointerMove);

  //   return () => window.removeEventListener("pointermove", handlePointerMove);
  // }, []);

  // Auto-scroll logic
  // useEffect(() => {
  //   if (!isDragging || !listRef.current) return;

  //   const container = listRef.current;
  //   const buffer = 50; // Distance in px from the edge to start scrolling
  //   const scrollSpeed = 20; // Pixels to scroll per interval
  //   const intervalTime = 50; // Interval time in ms

  //   const scrollInterval = setInterval(() => {
  //     if (!pointerY.current) return;

  //     const rect = container.getBoundingClientRect();

  //     if (pointerY.current < rect.top + buffer) {
  //       container.scrollBy({ top: -scrollSpeed, behavior: "smooth" });
  //     } else if (pointerY.current > rect.bottom - buffer) {
  //       container.scrollBy({ top: scrollSpeed, behavior: "smooth" });
  //     }
  //   }, intervalTime);

  //   return () => clearInterval(scrollInterval);
  // }, [isDragging]);

  function closeModal() {
    onClose();
    if (!orders) return;
    function onSuccess() {
      router.refresh();
    }
    const newOrders = orders.map((order, index) => ({ orderId: order.id, index: index + 1 }));
    serverAction({ data: newOrders, onSuccess });
  }

  useEffect(() => {
    async function sedData() {
      if (!orderIds) return;
      const newOrders = allOrders.filter((order) => orderIds?.includes(order.id));
      const userIds = [...new Set(newOrders.map((order) => order.user.id))];
      const beginDay = addDays(newOrders[0].shippingDate.setHours(0, 0, 0, 0), -7);
      const endDay = addDays(beginDay, 1);
      console.log({ beginDay, endDay });

      if (newOrders.some((order) => !order.index)) {
        const responce = await getOrdersIndexAction({ data: { userIds, beginDay, endDay } });
        if (responce) {
          for (const order of newOrders) {
            if (!order.index) {
              order.index = responce.find((o) => o.userId === order.user.id)?.index || null;
            }
          }
        }
      }
      setOrders(
        newOrders.sort((a, b) => {
          if (a.index === null) return -1;
          if (b.index === null) return 1;
          return (a.index ?? 0) - (b.index ?? 0);
        }),
      );
    }
    sedData();
  }, [orderIds, allOrders, getOrdersIndexAction]);
  if (!orders) return null;
  return (
    <Modal title="Ordonner les commandes" isOpen={open} onClose={closeModal}>
      {loading && <Spinner className="absolute right-4 top-4" />}
      <ScrollArea className=" max-h-[70dvh] overflow-auto ">
        <Reorder.Group
          as="ul"
          values={orders}
          onReorder={setOrders}
          className="flex flex-col gap-2  p-2  relative"
          axis="y"
          layoutScroll
          // ref={listRef}
        >
          {orders.map((order, index) => (
            <OrderItem key={order.id} order={order} index={index} />
          ))}
        </Reorder.Group>
      </ScrollArea>
    </Modal>
  );
}

export default OrdersModal;

function OrderItem({
  order,
  index,
  setIsDragging,
}: { order: CalendarOrdersType; index: number; setIsDragging?: (dragging: boolean) => void }) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const controls = useDragControls();

  return (
    <Reorder.Item
      style={{ boxShadow, y }}
      value={order}
      id={order.id}
      dragListener={false}
      dragControls={controls}
      as="li"
      className="p-4 border rounded-md cursor-pointer flex gap-2"
      // onDragStart={() => setIsDragging(true)}
      // onDragEnd={() => setIsDragging(false)}
    >
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          controls.start(e);
        }}
        className="flex gap-2 items-center justify-center"
      >
        {" "}
        <Grip className="size-4" /> <p>{index + 1}</p>
      </div>
      <NameWithImage name={order.name} image={order.user.image} imageSize={12} />
    </Reorder.Item>
  );
}
