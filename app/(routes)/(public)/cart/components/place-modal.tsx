"use client";
import { AddressInput } from "@/components/display-shops.tsx/address-input";
import NameInput from "@/components/display-shops.tsx/name-input";
import { ShopCard } from "@/components/display-shops.tsx/shop-card";
import { Modal } from "@/components/ui/modal";
import { Shop } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";

interface PlaceModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  shops: Shop[];
  onSelect: (shopId: string) => void;
}

const PlaceModal = ({
  isOpen,
  setIsOpen,
  shops,
  onSelect,
}: PlaceModalProps) => {
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({
    long: undefined,
    lat: undefined,
  });

  return (
    <Modal
      title="Choisir votre lieu de retrait"
      description="Trouvez le magasin le plus proche de chez vous"
      isOpen={isOpen}
      onClose={() => setIsOpen((prev) => !prev)}
      className=" hide-scrollbar left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[90%] overflow-y-scroll"
    >
      <div className=" space-y-8 p-2">
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
              onSelect={(shopId: string) => {
                onSelect(shopId);
                setIsOpen(false);
              }}
              display="cart"
              shop={shop}
              key={shop.name}
              coordinates={coordinates}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default PlaceModal;
