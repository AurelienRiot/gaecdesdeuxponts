"use client";
import { AddressInput } from "@/app/(routes)/(public)/find/components/address-input";
import { ShopCard } from "@/app/(routes)/(public)/find/components/shop-card";
import { Shop } from "@prisma/client";
import { useState } from "react";
import NameInput from "./name-input";
import { Heading } from "@/components/ui/heading";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopForm from "./shop-form";
import { AnimateHeight } from "@/components/animations/animate-size";

const DisplayShop = ({ data }: { data: Shop[] }) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(data);
  const [open, setOpen] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };
  return (
    <>
      <Heading
        title="Liste des magasins"
        description="Afficher et modifier les magasins"
      />
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
        <Button onClick={onClick}>
          {!open ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un nouveau
            </>
          ) : (
            <>
              <X className="mr-2 h-4 w-4" />
              Fermé
            </>
          )}
        </Button>
      </div>

      <AnimateHeight display={open}>
        <ShopForm setOpen={setOpen} />
      </AnimateHeight>

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard shop={shop} key={shop.name} coordinates={coordinates} />
        ))}
      </div>
    </>
  );
};

export default DisplayShop;
