"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { User } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CardUser from "./card-user";

interface UserClientProps {
  users: User[];
  orderLengths: number[];
}

const UserClient: React.FC<UserClientProps> = ({ users, orderLengths }) => {
  const [search, setSearch] = useState("");

  const searchKeys = ["email", "name", "phone", "addresse"];
  const displayKeys = ["email", "nom", "téléphone", "addresse"];
  const [selectValue, setSelectValue] = useState(searchKeys[1]);

  const filteredUsers = users.filter((user) => {
    const value = String(user[selectValue as keyof User]);
    return value.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <div className="m-4">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <Heading title={`Clients (${filteredUsers.length})`} description="Liste des clients" />
          <Button className="m-2 pb-6 pt-6 sm:ml-2 sm:pb-0 sm:pt-0" asChild>
            <Link href={`/admin/users/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un client
            </Link>
          </Button>
        </div>
        <div className="justify-content-center mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Recherche" />

          <Select
            defaultValue={selectValue}
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
        </div>
        <div className="grid grid-cols-1 items-center justify-items-center gap-3 p-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredUsers.map((user, index) => (
            <CardUser key={user.id} className="m-4" user={user} orderLength={orderLengths[index]} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserClient;
