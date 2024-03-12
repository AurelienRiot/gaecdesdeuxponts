"use client";
import { AddressInput } from "@/components/display-shops/address-input";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Shop } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NameInput from "../../../../../components/display-shops/name-input";
import { ShopCard } from "../../../../../components/display-shops/shop-card";

const DisplayShop = ({ data }: { data: Shop[] }) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(data);
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <Heading
          title={`Liste des magasins (${data.length})`}
          description="Afficher et modifier les magasins"
        />
        <Button
          onClick={() => router.push(`/admin/shops/new`)}
          className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0"
        >
          <Plus className="mr-2  h-4 w-4" />
          Ajouter un nouveau
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2">
        <AddressInput
          setSortedShops={setSortedShops}
          setCoordinates={setCoordinates}
          shops={data}
        />
        <NameInput
          setSortedShops={setSortedShops}
          shops={data}
          className="w-fit"
        />
      </div>

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard
            shop={shop}
            key={shop.name}
            coordinates={coordinates}
            display="admin"
          />
        ))}
      </div>
    </>
  );
};

export default DisplayShop;
