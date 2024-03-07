import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarSearch,
  CreditCardIcon,
  EuroIcon,
  Package,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Présentation de votre magasin"
        />
        <Separator />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenue Totaux
              </CardTitle>
              <EuroIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Produits en stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {" "}
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Abonnements en stock
              </CardTitle>
              <CalendarSearch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// const TotalRevenue = async () => {
//   const totalRevenue = await GetTotalRevenue();
//   return formatter.format(totalRevenue);
// };

// const SalesCount = async () => {
//   const salesCount = await GetSalesCount();
//   return String(salesCount);
// };

// const StockOrderCount = async () => {
//   const stockOrderCount = await GetStockOrderCount();
//   return String(stockOrderCount);
// };

// const StockSubscriptionCount = async () => {
//   const stockSubscriptionCount = await GetStockSubscriptionCount();
//   return String(stockSubscriptionCount);
// };

// const GraphRevenue = async () => {
//   const graphRevenue = await GetGraphRevenue();
//   return <DynamicOverview data={graphRevenue} />;
// };
