import { AnimateHeight } from "@/components/animations/animate-size";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface DisplayAmapProps {
  amapOrders: {
    shopName: string;
    shopImageUrl: string | null;
    order:
      | {
          date: string;
          items: {
            itemId: string;
            name: string;
            unit?: string | null | undefined;
            totalQuantity: number;
          }[];
        }
      | undefined;
  }[];
  className?: string;
}

const DisplayAmap: React.FC<DisplayAmapProps> = ({ amapOrders, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return amapOrders.map((order) => {
    if (!order.order) return null;

    return (
      <Card key={order.shopName} className={cn("w-full max-w-sm ", className)}>
        <CardHeader
          className="grid grid-cols-8   items-center  py-2 px-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 col-span-7">
            {order.shopImageUrl ? (
              <Image
                src={order.shopImageUrl}
                alt={order.shopName}
                width={24}
                height={24}
                className="rounded-sm object-contain"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xs">{order.shopName.charAt(0)}</span>
              </div>
            )}
            <span className="font-medium text-xs truncate">{order.shopName}</span>
          </div>

          {/* <Link
          onClick={(e) => {
            // e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
          }}
          href={`/admin/orders/${order.id}`}
        >
          <StatusCell status={order.status} />
        </Link> */}
          <div className="flex justify-end">
            <ChevronDown
              data-state={isExpanded}
              className="h-4 w-4 data-[state=true]:rotate-180 transition-transform duration-500"
            />
          </div>
        </CardHeader>
        <AnimateHeight display={isExpanded}>
          <CardContent className="py-2 px-4">
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-semibold">Produits :</h4>
                <ul className="text-xs space-y-0.5">
                  {order.order.items.map((product, index) => (
                    <li key={index} className="flex justify-between">
                      <span>
                        {product.name} (
                        {product.unit ? `${product.totalQuantity}${product.unit}` : `x${product.totalQuantity}`})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold">Total : {order.totalPrice}</p>
                <p className="text-[10px] text-gray-500">Livraison {relativeDate}</p>
              </div>
              <Button asChild variant="outline" size="sm" className="h-6 text-xs px-2">
                <Link href={`/admin/orders/${order.id}`}>Éditer</Link>
              </Button>
            </div> */}
            </div>
          </CardContent>
        </AnimateHeight>
      </Card>
    );
  });
};

export default DisplayAmap;
