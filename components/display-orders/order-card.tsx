"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { dateFormatter, getRelativeDate } from "@/lib/date-utils";
import { currencyFormatter } from "@/lib/utils";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StatusCell, type Status } from "../table-custom-fuction/cell-orders";
import { Button } from "../ui/button";
import { AnimateHeight } from "../animations/animate-size";

export type OrderCardProps = {
  id: string;
  image: string | null;
  userId: string;
  name: string;
  shippingDate: Date;
  totalPrice: string;
  products: string;
  status: Status;
  productsList: { name: string; price: number; quantity?: string; unit?: string }[];
  shopName: string;
  shopId: string;
  createdAt: Date;
};

function OrderCard({ order }: { order: OrderCardProps }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!order) return null;

  const shippingDate = dateFormatter(order.shippingDate, { days: true });
  const relativeDate = getRelativeDate(order.shippingDate);

  return (
    <Card className="w-full max-w-sm ">
      <CardHeader
        className="flex  items-center justify-start py-2 px-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Link href={`/admin/users/${order.userId}`} className="flex items-center gap-2 ">
          {order.image ? (
            <Image src={order.image} alt={order.name} width={24} height={24} className="rounded-md object-contain" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-xs">{order.name.charAt(0)}</span>
            </div>
          )}
          <span className="font-medium text-xs truncate">{order.name}</span>
        </Link>
        <div className="text-xs text-gray-500 whitespace-nowrap flex items-center font-semibold">
          <Calendar className="h-3 w-3  mr-2" />
          <span>{shippingDate}</span>
        </div>
        <Link href={`/admin/orders/${order.id}`}>
          <StatusCell status={order.status} />
        </Link>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CardHeader>
      <AnimateHeight display={isExpanded}>
        <CardContent className="py-2 px-4">
          <div className="space-y-2">
            <Link href={order.shopId ? `/admin/shops/${order.shopId}` : "#"} className="font-bold">
              {order.shopName}
            </Link>
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
              <Link href={`/admin/orders/${order.id}`} passHref>
                <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                  Éditer
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </AnimateHeight>
    </Card>
  );
}

export default OrderCard;
