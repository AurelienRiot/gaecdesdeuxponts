import { AnimateHeight } from "@/components/animations/animate-size";
import type { OrderCardProps } from "@/components/display-orders/order-card";
import { StatusCell } from "@/components/table-custom-fuction/cell-orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getRelativeDate } from "@/lib/date-utils";
import { cn, currencyFormatter } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface DisplayOrderProps {
  order: OrderCardProps;
  className?: string;
}

const DisplayOrder: React.FC<DisplayOrderProps> = ({ order, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const relativeDate = getRelativeDate(order.shippingDate);

  return (
    <Card className={cn("w-full max-w-sm ", className)}>
      <CardHeader
        className="flex items-center justify-start py-2 px-4 cursor-pointer "
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-11  items-center w-full">
          <Link
            onClick={(e) => {
              // e.nativeEvent.stopImmediatePropagation();
              e.stopPropagation();
            }}
            // href={`/admin/users/${order.userId}`}
            href={"#"}
            className="flex col-span-5 items-center gap-2 "
          >
            {order.image ? (
              <Image src={order.image} alt={order.name} width={24} height={24} className="rounded-sm object-contain" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xs">{order.name.charAt(0)}</span>
              </div>
            )}
            <span className="font-medium text-xs truncate">{order.name}</span>
          </Link>

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
              <ul className="text-xs space-y-0.5">
                {order.productsList.map((product, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {product.name} ({product.unit ? `${product.quantity}${product.unit}` : `x${product.quantity}`})
                    </span>
                    <span>{currencyFormatter.format(product.price)}</span>
                  </li>
                ))}
              </ul>
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
