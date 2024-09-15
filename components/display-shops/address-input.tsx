import type { Suggestion } from "@/actions/adress-autocompleteFR";
import { haversine } from "@/lib/math";
import type { Shop } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import SearchAddress from "../search-address";

type AddressInputProps = {
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  setCoordinates: Dispatch<SetStateAction<{ long: number | undefined; lat: number | undefined }>>;
  shops: Shop[];
  className?: string;
};

export const AddressInput = ({ setSortedShops, setCoordinates, shops, className }: AddressInputProps) => {
  function onSelectAddress(address: Suggestion) {
    setSortedShops(sortShops({ lat: address.latitude, long: address.longitude, shops }));
    setCoordinates({ lat: address.latitude, long: address.longitude });
  }

  return <SearchAddress onValueChange={onSelectAddress} triggerClassName={className} />;
};

export const sortShops = ({
  long,
  lat,
  shops,
}: {
  long: number | undefined;
  lat: number | undefined;
  shops: Shop[];
}) => {
  if (long !== undefined && lat !== undefined) {
    const shopsWithDistance = shops.map((shop) => ({
      ...shop,
      distance: haversine(
        { lat, long },
        {
          long: shop.long,
          lat: shop.lat,
        },
      ),
    }));

    const sorted = shopsWithDistance
      .filter((shop) => shop.distance !== undefined)
      .sort((a, b) => (a.distance as number) - (b.distance as number));
    return sorted;
  }
  return shops;
};
