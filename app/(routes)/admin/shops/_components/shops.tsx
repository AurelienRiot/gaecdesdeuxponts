"use client";
import NameInput from "@/components/display-shops/name-input";
import { ShopCard } from "@/components/display-shops/shop-card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Toggle } from "@/components/ui/toggle";
import type { FullShop } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DisplayShop = ({ data }: { data: FullShop[] }) => {
  const [sortedShops, setSortedShops] = useState<FullShop[]>(data.filter((shop) => shop.isArchived === false));
  const router = useRouter();

  const onPressedChange = (value: boolean) => {
    setSortedShops(data.filter((shop) => shop.isArchived === value));
  };

  useEffect(() => {
    setSortedShops((prev) => {
      if (prev.length > 0 && prev[0].isArchived) {
        return data.filter((shop) => shop.isArchived === true);
      }
      return data.filter((shop) => shop.isArchived === false);
    });
  }, [data]);

  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading title={`Liste des magasins (${data.length})`} description="Afficher et modifier les magasins" />
        <Button onClick={() => router.push(`/admin/shops/new`)} className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0">
          <Plus className="mr-2  h-4 w-4" />
          Ajouter un nouveau
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2">
        <NameInput setSortedShops={setSortedShops} shops={data} className="w-fit" />
        <Toggle aria-label="Toggle archivé" variant={"outline"} onPressedChange={onPressedChange}>
          Archivé
        </Toggle>
      </div>

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard shop={shop} key={shop.name} coordinates={{ lat: undefined, long: undefined }} display="admin" />
        ))}
      </div>
    </>
  );
};

export default DisplayShop;
