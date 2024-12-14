"use client";
import { Input } from "@/components/ui/input";
import { sanitizeString } from "@/lib/id";
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
    const newSearch = sanitizeString(value.target.value);
    console.log({
      newSearch,
    });
    const sortedShops = [...shops]
      .filter((shop) => sanitizeString(shop.name).includes(newSearch))
      .sort((a, b) => {
        const distanceA = sanitizeString(a.name).indexOf(newSearch);
        const distanceB = sanitizeString(b.name).indexOf(newSearch);
        return distanceA - distanceB;
      });

    setSortedShops(sortedShops);
  };
  return <Input value={search} onChange={onChange} placeholder="Filtrer par nom" {...props} />;
};

export default NameInput;
