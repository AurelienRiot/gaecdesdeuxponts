import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Modal } from "@/components/ui/modal";
import NoResults from "@/components/ui/no-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import useServerAction from "@/hooks/use-server-action";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Grip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import updateOrdersIndex from "../_actions/update-orders-index";
import type { CalendarOrdersType } from "../_functions/get-orders";
import { useRaisedShadow } from "./use-raised-shadow";

function OrdersModal({
  open,
  onClose,
  initialOrders,
}: {
  open: boolean;
  onClose: () => void;
  initialOrders: CalendarOrdersType[];
}) {
  const { serverAction } = useServerAction(updateOrdersIndex);
  const [orders, setOrders] = useState<CalendarOrdersType[]>();
  const router = useRouter();

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
    setOrders(initialOrders);
  }, [initialOrders]);

  // useEffect(() => {
  //   async function sedData() {
  //     if (!orderIds) return;
  //     const newOrders = allOrders.filter((order) => orderIds?.includes(order.id));

  //     if (!newOrders.length) return;
  //     const userIds = [...new Set(newOrders.map((order) => order.user.id))];
  //     const beginDay = addDays(newOrders[0].shippingDate.setHours(0, 0, 0, 0), -7);
  //     const endDay = addDays(beginDay, 1);

  //     if (newOrders.some((order) => !order.index)) {
  //       const responce = await getOrdersIndexAction({ data: { userIds, beginDay, endDay } });
  //       if (responce) {
  //         for (const order of newOrders) {
  //           if (!order.index) {
  //             order.index = responce.find((o) => o.userId === order.user.id)?.index || null;
  //           }
  //         }
  //       }
  //     }
  //     setOrders(
  //       newOrders.sort((a, b) => {
  //         if (a.index === null) return -1;
  //         if (b.index === null) return 1;
  //         return (a.index ?? 0) - (b.index ?? 0);
  //       }),
  //     );
  //   }
  //   sedData();
  // }, [orderIds, allOrders, getOrdersIndexAction]);

  return (
    <Modal title="Ordonner les commandes" isOpen={open} onClose={closeModal}>
      <ReorderItem orders={orders} setOrders={setOrders} />
    </Modal>
  );
}

export default OrdersModal;

function ReorderItem({
  orders,
  setOrders,
}: { orders: CalendarOrdersType[] | undefined; setOrders: (orders: CalendarOrdersType[]) => void }) {
  if (!orders) return <NoResults />;
  return (
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
  );
}

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
