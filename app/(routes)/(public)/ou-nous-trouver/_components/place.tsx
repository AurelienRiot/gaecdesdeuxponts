"use client";
import { AddressInput } from "@/components/display-shops/address-input";
import NameInput from "@/components/display-shops/name-input";
import { ShopCard } from "@/components/display-shops/shop-card";
import { Shop } from "@prisma/client";
import "leaflet/dist/leaflet.css";
import dynamicImport from "next/dynamic";
import { useState } from "react";

const Leaflet = dynamicImport(() => import("./leaflet"), {
  ssr: false,
});

const PlacePicker = ({
  shops,
  farmShop,
}: {
  shops: Shop[];
  farmShop: Shop | null;
}) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);

  return (
    <>
      <Leaflet
        shops={shops}
        farmShop={farmShop}
        setCoordinates={setCoordinates}
        coordinates={coordinates}
      />
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

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

export default PlacePicker;