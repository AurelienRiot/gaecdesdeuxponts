"use client";
import { useState } from "react";
import { AddressInput } from "@/components/display-shops/address-input";
import { Shop } from "@prisma/client";
import NameInput from "@/components/display-shops/name-input";
import { ShopCard } from "@/components/display-shops/shop-card";

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
      0
    </>
  );
};
