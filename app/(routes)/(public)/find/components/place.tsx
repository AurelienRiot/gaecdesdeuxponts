"use client";
import { useState } from "react";
import { AddressInput } from "./address-input";
import { ShopCard } from "./shop-card";
import { Shop } from "@prisma/client";

export const PlacePicker = ({ shops }: { shops: Shop[] }) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);

  return (
    <>
      <AddressInput
        setSortedShops={setSortedShops}
        setCoordinates={setCoordinates}
        shops={shops}
      />

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard shop={shop} key={shop.name} coordinates={coordinates} />
        ))}
      </div>
    </>
  );
};
