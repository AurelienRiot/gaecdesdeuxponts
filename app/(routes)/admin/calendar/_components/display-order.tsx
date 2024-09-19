import { AnimateHeight } from "@/components/animations/animate-size";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRelativeDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CalendarOrdersType } from "../_functions/get-orders";
import DisplayItem from "./display-item";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { TextArea } from "@/components/text-area";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

interface DisplayOrderProps {
  order: CalendarOrdersType;
  className?: string;
}

const DisplayOrder: React.FC<DisplayOrderProps> = ({ order, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const relativeDate = getRelativeDate(order.shippingDate);
  const viewUser = useConfirm();
  const router = useRouter();

  async function handleClick() {
    const result = await viewUser({
      title: "Information du client",
      content: <UserInfo user={order.user} />,
    });
    if (result) {
      router.push(`/admin/users/${order.user.id}`);
    }
  }

  return (
    <Card className={cn("w-full max-w-sm ", className)}>
      <CardHeader
        className="flex items-center justify-start py-2 px-4 cursor-pointer "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-11  items-center w-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="flex col-span-5 items-center gap-2 "
          >
            {order.user.image ? (
              <Image
                src={order.user.image}
                alt={order.name}
                width={24}
                height={24}
                className="rounded-sm object-contain"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xs">{order.name.charAt(0)}</span>
              </div>
            )}
            <span className="font-medium text-xs truncate">{order.name}</span>
          </button>

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
            <div className="flex justify-between">
              <Link href={order.shopId ? `/admin/shops/${order.shopId}` : "#"} className="font-bold">
                {order.shopName}
              </Link>
              <p>{order.id}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold">Produits :</h4>
              <DisplayItem items={order.productsList} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold">Total : {order.totalPrice}</p>
                <p className="text-[10px] text-gray-500">Livraison {relativeDate}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="h-6 text-xs px-2">
                <Link href={`/admin/orders/${order.id}`}>Éditer</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </AnimateHeight>
    </Card>
  );
};

export default DisplayOrder;

const InfoItem = ({ label, value }: { label: string; value: string | null | undefined }) =>
  value ? (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      {label === "Notes" ? (
        <AutosizeTextarea className="border-0 focus-visible:ring-0" readOnly value={value} />
      ) : (
        <p className="mt-1 text-sm text-gray-900">{value}</p>
      )}
    </div>
  ) : null;

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
        <h2 className="text-lg font-semibold">{user.name || "Unknown User"}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
    <div className="max-h-[40dvh] overflow-y-auto px-4">
      <InfoItem label="Entreprise" value={user.company} />
      <InfoItem label="Adresse" value={user.address} />
      <InfoItem label="Notes" value={user.notes} />
    </div>
  </div>
);
