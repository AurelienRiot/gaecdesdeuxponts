import { ShopCard } from "@/components/skeleton-ui/shop-card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import prismadb from "@/lib/prismadb";
import { ChevronDown, Plus } from "lucide-react";
import { Suspense } from "react";
import DisplayShop from "./_components/shops";

export const dynamic = "force-dynamic";

const ShopPage = async () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense fallback={<DisplayShopLoading />}>
          <ServerShopPage />
        </Suspense>
      </div>
    </div>
  );
};

export default ShopPage;

const ServerShopPage = async () => {
  const shops = await prismadb.shop.findMany({
    include: { links: true, shopHours: { orderBy: { day: "asc" } } },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return <DisplayShop data={shops} />;
};

const DisplayShopLoading = () => (
  <>
    <div className="flex flex-col items-center justify-between sm:flex-row">
      <Heading title={`Liste des magasins`} description="Afficher et modifier les magasins" />
      <Button className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
        <Plus className="mr-2  h-4 w-4" />
        Ajouter un nouveau
      </Button>
    </div>

    <div className="flex flex-wrap items-center justify-start gap-2">
      <Button disabled variant="outline" role="combobox" className={" justify-between active:scale-100 "}>
        Rechercher votre adresse
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <Input disabled className="w-fit" placeholder="Rechercher le nom" />
    </div>

    <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {Array(10)
        .fill(null)
        .map((_, i) => (
          <ShopCard display="admin" key={String(i)} />
        ))}
    </div>
  </>
);
