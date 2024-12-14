"use client";
import { Input } from "@/components/ui/input";
import type { FullShop } from "@/types";
import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from "react";

interface NameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setSortedShops: Dispatch<SetStateAction<FullShop[]>>;
  shops: FullShop[];
}

const NameInput = ({ setSortedShops, shops, ...props }: NameInputProps) => {
  const [search, setSearch] = useState("");

  const onChange = (value: ChangeEvent<HTMLInputElement>) => {
    setSearch(value.target.value);
    const sortedShops = [...shops]
      .filter((shop) => shop.name.normalize("NFD").toLowerCase().includes(search.normalize("NFD").toLowerCase()))
      .sort((a, b) => {
        const distanceA = a.name.normalize("NFD").toLowerCase().indexOf(search.normalize("NFD").toLowerCase());
        const distanceB = b.name.normalize("NFD").toLowerCase().indexOf(search.normalize("NFD").toLowerCase());
        return distanceA - distanceB;
      });

    setSortedShops(sortedShops);
  };
  return <Input value={search} onChange={onChange} placeholder="Filtrer par nom" {...props} />;
};

export default NameInput;
