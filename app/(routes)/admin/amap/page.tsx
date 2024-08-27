import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { DateRange } from "react-day-picker";
import { AMAPClient } from "./_components/client";
import type { AMAPColumn } from "./_components/columns";
import { createProduct, createProductList } from "@/components/table-custom-fuction/cell-orders";

export const dynamic = "force-dynamic";

async function AMAPPage(context: {
  searchParams: { from: string | undefined; to: string | undefined; id: string | undefined };
}) {
  const id = context.searchParams.id;

  let from: Date;
  let to: Date;
  if (context.searchParams.from && context.searchParams.to) {
    from = new Date(context.searchParams.from);
    to = new Date(context.searchParams.to);
  } else {
    from = new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    to = new Date(new Date().getTime() + 2 * 30 * 24 * 60 * 60 * 1000);
  }

  const dateRange: DateRange = {
    from: from,
    to: to,
  };

  const amapOrders = await prismadb.aMAPOrder.findMany({
    where: !id
      ? {
          startDate: {
            gte: dateRange.from,
            lte: dateRange.to,
          },
        }
      : {
          id: {
            contains: id,
          },
        },
    include: { user: true, amapItems: true, shop: true },
  });

  const formattedOrders: AMAPColumn[] = amapOrders.map((order) => ({
    id: order.id,
    userId: order.user.id,
    name: order.user.company || order.user.name || order.user.email || "",
    shopName: order.shop.name,
    shopId: order.shop.id,
    totalPrice: order.totalPrice,
    startDate: order.startDate,
    endDate: order.endDate,
    shippingDays: order.shippingDays,
    dateOfEdition: order.dateOfEdition,
    productsList: createProductList(order.amapItems),
    products: createProduct(order.amapItems),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Heading title={`Contrat AMAP (${amapOrders.length})`} description="Liste des différents contrats AMAP" />
          <Button asChild className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
            <Link href={`/admin/amap/new`}>
              <Plus className="mr-2  h-4 w-4" />
              Créer un nouveau
            </Link>
          </Button>
        </div>

        <Separator />
        <AMAPClient initialData={formattedOrders} initialDateRange={dateRange} />
      </div>
    </div>
  );
}

export default AMAPPage;
