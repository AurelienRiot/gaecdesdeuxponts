"use client";
import { AnimateHeight } from "@/components/animations/animate-size";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button, IconButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, MouseEventHandler, useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayItem from "./display-item";
import { useUserModal } from "./user-modal";

interface DisplayOrderProps {
  order: CalendarOrdersType;
  className?: string;
  newOrder?: boolean;
  otherOrders: CalendarOrdersType[];
}

const DisplayOrder: React.FC<DisplayOrderProps> = ({ order, className, newOrder, otherOrders }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Card className={cn("w-full max-w-sm ", className)}>
        <CardHeader
          className="flex relative items-center justify-start py-2 px-4 cursor-pointer "
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {newOrder && <IconButton className="size-4 p-0.5 text-green-500 absolute top-0.5 left-0.5 " Icon={Check} />}
          <div className="grid grid-cols-11  items-center w-full">
            <SetUserModal order={order} otherOrders={otherOrders} />

            <StatusCell status={order.status} className="col-span-5 justify-center" />
            <div className="flex justify-end">
              <ChevronDown
                data-state={isExpanded}
                className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
              />
            </div>
          </div>
        </CardHeader>
        <AnimateHeight display={isExpanded}>
          <CardContent className="py-2 px-4">
            <div className="space-y-2">
              <div className="flex justify-left">
                <Link href={order.shopId ? `/admin/shops/${order.shopId}` : "#"} className="font-bold">
                  {order.shopName}
                </Link>
                {/* <p>{order.id}</p> */}
              </div>
              <div>
                <h4 className="text-xs font-semibold">Produits :</h4>
                <DisplayItem items={order.productsList} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold">Total : {order.totalPrice}</p>
                  {/* <p className="text-[10px] text-gray-500">Livraison {relativeDate}</p> */}
                </div>
                <Button asChild variant="secondary" className="text-sm border-dashed border">
                  <Link href={`/admin/orders/${order.id}`}>Éditer</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </AnimateHeight>
      </Card>
    </>
  );
};

function SetUserModal({ order, otherOrders }: { order: CalendarOrdersType; otherOrders: CalendarOrdersType[] }) {
  const { setUser, setIsUserModalOpen } = useUserModal();

  function setUserForModal(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    setUser({
      ...order.user,
      orders: otherOrders.sort((a, b) => b.shippingDate.getTime() - a.shippingDate.getTime()),
      date: order.shippingDate,
    });
    setIsUserModalOpen(true);
  }
  return (
    <button type="button" onClick={setUserForModal} className="col-span-5  ">
      <NameWithImage name={order.name} image={order.user.image} imageSize={12} completed={order.user.completed} />
    </button>
  );
}

export default DisplayOrder;
