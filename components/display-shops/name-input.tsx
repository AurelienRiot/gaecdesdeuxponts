"use client";
import { Input } from "@/components/ui/input";
import type { Shop } from "@prisma/client";
import { type ChangeEvent, type Dispatch, type SetStateAction, useState } from "react";

interface NameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  shops: Shop[];
}

const NameInput = ({ setSortedShops, shops, ...props }: NameInputProps) => {
  const [search, setSearch] = useState("");

  const onChange = (value: ChangeEvent<HTMLInputElement>) => {
    setSearch(value.target.value);
    const sortedShops = [...shops].sort((a, b) => {
      const normalizedSearchTerm = search.toLowerCase();
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      const matchA = nameA.includes(normalizedSearchTerm) ? 1 : 0;
      const matchB = nameB.includes(normalizedSearchTerm) ? 1 : 0;

      // If one name contains the search term and the other does not, the one with the search term goes first
      if (matchA !== matchB) {
        return matchB - matchA;
      }

      // If both contain the search term or neither does, sort alphabetically
      return nameA.localeCompare(nameB);
    });

    setSortedShops(sortedShops);
  };
  return <Input value={search} onChange={onChange} placeholder="Rechercher par nom" {...props} />;
};

export default NameInput;
