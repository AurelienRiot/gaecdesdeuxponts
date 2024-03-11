"use client";
import { useState } from "react";
import { AddressInput } from "@/components/display-shops.tsx/address-input";
import { Shop } from "@prisma/client";
import NameInput from "@/components/display-shops.tsx/name-input";
import { ShopCard } from "@/components/display-shops.tsx/shop-card";

export const PlacePicker = ({ shops }: { shops: Shop[] }) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);

  return (
    <>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <AddressInput
          setSortedShops={setSortedShops}
          setCoordinates={setCoordinates}
          shops={shops}
        />
        <NameInput
          setSortedShops={setSortedShops}
          shops={shops}
          className="w-fit"
        />
      </div>

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard
            display="find"
            shop={shop}
            key={shop.name}
            coordinates={coordinates}
          />
        ))}
      </div>
    </>
  );
};
