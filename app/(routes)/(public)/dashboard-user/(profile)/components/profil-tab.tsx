"use client";
import { Address, Role } from "@prisma/client";
import { UserButtons } from "./user-buttons";
import UserPhone from "./user-phone";
import { useEffect, useState } from "react";

const ProfilTab = ({
  user: initialData,
}: {
  user: {
    name: string;
    phone: string;
    email: string;
    adress: Address;
    role: Role;
  };
}) => {
  const [user, setUser] = useState(initialData);
  useEffect(() => {
    setUser(initialData);
  }, [initialData]);
  return (
    <>
      <div className="mx-auto my-4 flex h-fit w-fit flex-col items-center justify-center gap-2 rounded-md border-2 p-6 text-gray-800 shadow-xl dark:text-white">
        <>
          <h1 className="text-center text-3xl font-bold">
            <span className="capitalize">
              {user.name ? user.name : "Compléter votre profil"}
            </span>
          </h1>
        </>
        <UserButtons isPro={user.role === "user" ? false : true} />
      </div>
      <div className="text-md flex flex-col items-center justify-center text-gray-800 dark:text-white sm:text-xl">
        <div className="grid grid-cols-1 items-center justify-items-center gap-4 sm:grid-cols-2 sm:justify-items-start">
          <p className="font-bold ">Email :</p>
          <p>{user.email}</p>
          <p className="font-bold">Adresse :</p>
          {user.adress?.line1 ? (
            <p>
              {user.adress.line1} {user.adress.postalCode} {user.adress.city}{" "}
            </p>
          ) : (
            <p>Non renseigné</p>
          )}

          <p className="font-bold">Télephone :</p>
          <UserPhone phone={user.phone} />
        </div>
      </div>
    </>
  );
};

export default ProfilTab;
