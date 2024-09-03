"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import type { User } from "@prisma/client";
import { useState } from "react";
import CardUser, { type UserStatus } from "./card-user";

interface UserClientProps {
  users: User[];
  orderLengths: { length: number; id: string }[];
  statusArray: { status: UserStatus; id: string; display: boolean }[];
}
const keys = [
  { value: "email", label: "Email" },
  { value: "name", label: "Nom" },
  { value: "phone", label: "Téléphone" },
  { value: "addresse", label: "Addresse" },
  { value: "company", label: "Entreprise" },
];

const UserClient: React.FC<UserClientProps> = ({ users, orderLengths, statusArray }) => {
  const [search, setSearch] = useState("");
  const [selectValue, setSelectValue] = useState(keys[4].value);
  const [unpaid, setUnpaid] = useState(false);
  const [pro, setPro] = useState(false);

  const filteredUsers = users.filter((user) => {
    const value = String(user[selectValue as keyof User]);
    const valueSearch = value.toLowerCase().includes(search.toLowerCase());
    const unPaidSearch = !unpaid || statusArray.find((item) => item.id === user.id)?.status === "unpaid";
    const proSearch = !pro || users.find((item) => item.id === user.id)?.role === "pro";

    return valueSearch && unPaidSearch && proSearch;
  });

  return (
    <>
      <div className="justify-content-center mt-4 flex flex-wrap gap-4 ">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" placeholder="Recherche" />

        <Select
          value={selectValue}
          onValueChange={(newValue) => {
            setSelectValue(newValue);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            {keys.map((key) => (
              <SelectItem key={key.value} value={key.value}>
                {key.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Toggle aria-label="Toggle paid" variant={"outline"} className="w-fit " onPressedChange={setUnpaid}>
          Non payé
        </Toggle>
        <Toggle aria-label="Toggle pro" variant={"outline"} className="w-fit " onPressedChange={setPro}>
          Pro
        </Toggle>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 p-2 pt-4 ">
        {filteredUsers.map((user, index) => (
          <CardUser
            key={user.id}
            user={user}
            orderLength={orderLengths.find((orderLength) => orderLength.id === user.id)?.length || 0}
            status={statusArray.find((status) => status.id === user.id)?.status || "not send"}
            display={!!statusArray.find((status) => status.id === user.id)?.display}
          />
        ))}
      </div>
    </>
  );
};

export default UserClient;
