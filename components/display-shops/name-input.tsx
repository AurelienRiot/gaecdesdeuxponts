"use client";
import { Input } from "@/components/ui/input";
import { Shop } from "@prisma/client";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

interface NameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setSortedShops: Dispatch<SetStateAction<Shop[]>>;
  shops: Shop[];
}

const NameInput = ({ setSortedShops, shops, ...props }: NameInputProps) => {
  const [search, setSearch] = useState("");

  const onChange = (value: ChangeEvent<HTMLInputElement>) => {
    setSearch(value.target.value);
    const sortedShops = [...shops].sort((a, b) => {
      const searchLower = search.toLowerCase();
      const indexA = a.name.toLowerCase().indexOf(searchLower);
      const indexB = b.name.toLowerCase().indexOf(searchLower);

      // If one name contains the search term and the other does not, the one with the search term goes first
      if (indexA !== -1 && indexB === -1) {
        return -1; // A has the search term and B does not, A goes first
      } else if (indexB !== -1 && indexA === -1) {
        return 1; // B has the search term and A does not, B goes first
      }

      // If both names contain the search term, the one with the term appearing earlier goes first
      // If neither name contains the search term, or the search term appears at the same position, sort alphabetically
      if (indexA !== indexB) {
        return indexA - indexB;
      }

      // Secondary sorting condition: alphabetically
      return a.name.localeCompare(b.name);
    });

    setSortedShops(sortedShops);
  };
  return (
    <Input
      value={search}
      onChange={onChange}
      placeholder="Rechercher le nom"
      {...props}
    />
  );
};

export default NameInput;
