"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import type { User } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CardUser from "./card-user";

interface UserClientProps {
  users: User[];
  orderLengths: { length: number; id: string }[];
  isPaidArray: { isPaid: boolean; id: string; display: boolean }[];
}

const UserClient: React.FC<UserClientProps> = ({ users, orderLengths, isPaidArray }) => {
  const [search, setSearch] = useState("");
  const searchKeys = ["email", "name", "phone", "addresse", "company"];
  const displayKeys = ["Email", "Nom", "Téléphone", "Addresse", "Entreprise"];
  const [selectValue, setSelectValue] = useState(searchKeys[4]);
  const [toogle, setToogle] = useState(false);

  const filteredUsers = users.filter((user) => {
    const value = String(user[selectValue as keyof User]);
    if (toogle) {
      return (
        value.toLowerCase().includes(search.toLowerCase()) && !isPaidArray.find((item) => item.id === user.id)?.isPaid
      );
    }
    return value.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="justify-content-center mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recherche" />

        <Select
          value={selectValue}
          onValueChange={(newValue) => {
            setSelectValue(newValue);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            {searchKeys.map((key, index) => (
              <SelectItem key={key} value={key}>
                {String(displayKeys[index])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Toggle aria-label="Toggle paid" variant={"outline"} className="w-fit " onPressedChange={setToogle}>
          Non payé
        </Toggle>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 p-2 pt-4 ">
        {filteredUsers.map((user, index) => (
          <CardUser
            key={user.id}
            user={user}
            orderLength={orderLengths.find((orderLength) => orderLength.id === user.id)?.length || 0}
            isPaid={!!isPaidArray.find((isPaid) => isPaid.id === user.id)?.isPaid}
            display={!!isPaidArray.find((isPaid) => isPaid.id === user.id)?.display}
          />
        ))}
      </div>
    </>
  );
};

export default UserClient;
