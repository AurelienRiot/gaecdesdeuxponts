"use client";
import { AddressInput } from "@/components/display-shops/address-input";
import NameInput from "@/components/display-shops/name-input";
import { ShopCard } from "@/components/display-shops/shop-card";
import { Modal } from "@/components/ui/modal";
import  type { Shop } from "@prisma/client";
import { useRouter } from "next/navigation";
import {  type Dispatch, type  SetStateAction, useState } from "react";
import { makeCartUrl } from "./summary";
import { toast } from "sonner";

interface PlaceModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  shops: Shop[];
  date: Date | undefined;
}

const PlaceModal = ({ isOpen, setIsOpen, shops, date }: PlaceModalProps) => {
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({
    long: undefined,
    lat: undefined,
  });
  const router = useRouter();

  const onSelectPlace = (shopId: string | undefined) => {
    if (!shopId) {
      router.refresh();
      toast.error("Erreur veuillez réssayer");
      return;
    }

    router.push(makeCartUrl(shopId, date), {
      scroll: false,
    });
  };

  return (
    <Modal
      title="Choisir votre lieu de retrait"
      description="Trouvez le magasin le plus proche de chez vous"
      isOpen={isOpen}
      onClose={() => setIsOpen((prev) => !prev)}
      className=" left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[90%] overflow-y-scroll hide-scrollbar"
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
                onSelectPlace(shopId);
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
