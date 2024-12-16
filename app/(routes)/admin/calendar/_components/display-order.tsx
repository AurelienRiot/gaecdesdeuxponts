"use client";
import { AnimateHeight } from "@/components/animations/animate-size";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { NameWithImage } from "@/components/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CalendarOrderType } from "@/components/zod-schema/calendar-orders";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { toast } from "sonner";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import DisplayItem from "./display-item";
import { useUserModal } from "../../_components/user-modal";

interface DisplayOrderProps {
  order: CalendarOrderType;
  className?: string;
  newOrder?: boolean;
}

const DisplayOrder: React.FC<DisplayOrderProps> = ({ order, className, newOrder }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  return (
    <>
      <Card className={cn("w-full max-w-sm ", className)}>
        <CardHeader className="flex relative items-center justify-start py-2 px-4  ">
          <div className="grid grid-cols-11  items-center w-full">
            <SetUserModal order={order} newOrder={newOrder} />

            <StatusCell status={order.status} className="col-span-5 justify-center" />
            <button
              type="button"
              onClick={() => {
                if (!isExpanded) {
                  router.prefetch(`/admin/orders/${order.id}`);
                }
                setIsExpanded(!isExpanded);
              }}
              className="flex justify-end relative"
            >
              <div className="absolute inset-0 -translate-x-2 -translate-y-3 py-5 px-6 bg-transparent"></div>
              <ChevronDown
                data-state={isExpanded}
                className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
              />
            </button>
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

function SetUserModal({ order, newOrder }: { order: CalendarOrderType; newOrder?: boolean }) {
  const { data: users } = useUsersQuery();
  const user = users?.find((u) => u.id === order.userId);
  const { setUserId, setIsUserModalOpen } = useUserModal();
  const router = useRouter();

  function setUserForModal(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
    e.stopPropagation();
    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    setUserId(user.id);
    setIsUserModalOpen(true);
    router.prefetch(`/admin/users/${order.userId}`);
  }
  if (!user) {
    return <Skeleton className="col-span-5 " size={"xs"} />;
  }
  return (
    <button type="button" onClick={setUserForModal} className="col-span-5 relavive ">
      {newOrder && (
        <span
          className={
            "flex z-10  p-[1px] text-green-500 absolute top-0.5 left-0.5 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:scale-110 active:scale-95"
          }
        >
          <Check className="size-3" />
          <span className="sr-only">{"Nouvelle commande crée"}</span>
        </span>
      )}
      <NameWithImage name={order.userName} image={order.userImage} imageSize={12} completed={user.completed} />
    </button>
  );
}

export default DisplayOrder;
