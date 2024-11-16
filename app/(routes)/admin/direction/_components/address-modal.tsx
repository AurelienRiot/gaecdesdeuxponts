"use client";

import { Button, IconButton } from "@/components/ui/button";

import SearchAddress from "@/components/search-address";
import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import "leaflet/dist/leaflet.css";
import { House, Tractor } from "lucide-react";
import dynamicImport from "next/dynamic";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import "../../../(public)/ou-nous-trouver/_components/marker.css";
import type { UserAndShop } from "./direction-form";
import type { DirectionFormValues, Point } from "./direction-schema";
const MapModal = dynamicImport(() => import("./map-modal"), {
  ssr: false,
});

type AddressModalProps = {
  onValueChange?: (address: Point) => void;
  usersAndShops: UserAndShop[];
  value?: Point;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const AddressModal = ({ usersAndShops, onValueChange, value, setIsOpen, isOpen }: AddressModalProps) => {
  const form = useFormContext<DirectionFormValues>();
  const [input, setInput] = useState<Point>(value || { label: "" });

  useEffect(() => {
    if (value) {
      setInput(value);
    }
  }, [value]);
  function onClose(val: Point) {
    setInput(val);
    if (onValueChange) onValueChange(val);
    setIsOpen(false);
    form.clearErrors();
  }

  return (
    <>
      <Modal
        className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[700px]  rounded-sm "
        title=""
        description=""
        isOpen={isOpen}
        onClose={() => onClose(input)}
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <HouseSelect onSelect={onClose} />
            <FarmSelect onSelect={onClose} />
          </div>
          <AddressSelect usersAndShops={usersAndShops} onValueChange={onClose} />
          <SearchAddress onValueChange={onClose} />
          <MapModal onValueChange={onClose} />
          <Input
            placeholder="Adresse"
            onChange={(e) => {
              setInput({ label: e.target.value });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClose(input);
              }
            }}
            value={input.label}
          />
        </div>
      </Modal>
    </>
  );
};

function FarmSelect({ onSelect }: { onSelect: (val: Point) => void }) {
  return (
    <IconButton
      className="text-green-500"
      Icon={Tractor}
      onClick={() => onSelect({ label: "6 le Pont Robert 44290 Massérac" })}
    />
  );
}

function HouseSelect({ onSelect }: { onSelect: (val: Point) => void }) {
  return (
    <IconButton
      className="text-blue-500"
      Icon={House}
      onClick={() => onSelect({ label: "Pont de l'Eau, 44460 Avessac, France" })}
    />
  );
}

function AddressSelect({
  usersAndShops,
  onValueChange,
}: { usersAndShops: UserAndShop[]; onValueChange: (address: Point) => void }) {
  return (
    <SelectSheet
      title="Selectionner l'adresse"
      trigger={
        <Button variant="outline" role="combobox" id="select-address" className={cn("w-full justify-between pl-2")}>
          <span className="flex items-center">
            <FaRegUser className="h-4 w-4 mr-2 inline" />
            Rechercher un client
          </span>
        </Button>
      }
      values={usersAndShops.map((item) => ({
        label: <NameWithImage name={item.label} image={item.image} />,
        value: { key: item.address, longitude: item.longitude, latitude: item.latitude },
      }))}
      onSelected={(value) => {
        if (!value) return;
        onValueChange({ label: value.key, longitude: value.longitude, latitude: value.latitude });
      }}
    />
  );
}

export default AddressModal;
