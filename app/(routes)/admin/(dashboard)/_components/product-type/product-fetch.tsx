import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateMonthYear } from "@/lib/date-utils";
import prismadb from "@/lib/prismadb";
import DownloadChart from "../dowload-chart";
import PerUserItems from "./per-user-item";
import { ProductChart } from "./product-chart";

const ID = "quantite-produits";

const ProductsType = async ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
  const orderItems = await prismadb.orderItem.findMany({
    where: {
      order: {
        dateOfShipping: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      name: true,
      quantity: true,
      order: { select: { user: { select: { company: true, name: true, email: true } } } },
    },
  });

  const itemsPerUser = orderItems.reduce(
    (acc, item) => {
      const name = item.order.user.company || item.order.user.name || item.order.user.email || "Anonyme";
      if (!acc[name]) {
        acc[name] = {};
      }

      if (!acc[name][item.name]) {
        acc[name][item.name] = { name: item.name, positiveQuantity: 0, negativeQuantity: 0 };
      }
      if (item.quantity > 0) {
        acc[name][item.name].positiveQuantity += item.quantity;
      } else {
        acc[name][item.name].negativeQuantity += item.quantity;
      }
      return acc;
    },
    {} as Record<string, Record<string, { name: string; positiveQuantity: number; negativeQuantity: number }>>,
  );

  const groupedItems = orderItems.reduce(
    (acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = { name: item.name, positiveQuantity: 0, negativeQuantity: 0 };
      }
      if (item.quantity > 0) {
        acc[item.name].positiveQuantity += item.quantity;
      } else {
        acc[item.name].negativeQuantity += item.quantity;
      }
      return acc;
    },
    {} as Record<string, { name: string; positiveQuantity: number; negativeQuantity: number }>,
  );

  const chartData = Object.values(groupedItems).flatMap((item) => {
    const data = [];
    if (item.positiveQuantity !== 0) {
      data.push({ name: item.name, quantity: item.positiveQuantity });
    }
    if (item.negativeQuantity !== 0) {
      data.push({ name: item.name, quantity: item.negativeQuantity });
    }
    return data;
  });

  // return <ProductChart chartData={chartData} monthYear={dateMonthYear(startDate)} />;
  return (
    <Card id={ID} className=" w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex justify-between ">
          Quantité des produits
          <DownloadChart id={ID} />
        </CardTitle>
        <CardDescription className="capitalize">{dateMonthYear([startDate])}</CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        {orderItems.length > 0 ? (
          <Tabs defaultValue="total">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="grid grid-cols-1" value="total">
                Total
              </TabsTrigger>
              <TabsTrigger value="perUser">Par client</TabsTrigger>
            </TabsList>
            <TabsContent value="total" className="pt-4">
              <ProductChart chartData={chartData} />
            </TabsContent>
            <TabsContent value="perUser">
              <PerUserItems data={itemsPerUser} />
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center">Aucun produit acheté</p>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
};

export default ProductsType;
