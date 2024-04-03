"use client";
import { LogoutButtonText } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Address, Role } from "@prisma/client";
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { moveSelectedTabToTop, useTabsContext } from "./tabs-animate";
import UserPhone from "./user-phone";

const ProfilTab = ({
  user,
}: {
  user: {
    name: string;
    phone: string;
    email: string;
    adress: Address;
    role: Role;
  };
}) => {
  const { setTabs, setHovering } = useTabsContext();
  return (
    <div className="w-full space-y-10  p-6 ">
      <div className="flex flex-col items-center justify-between gap-y-6  pb-4 sm:flex-row">
        <h1 className="text-2xl font-semibold capitalize dark:text-white">
          {user.name || "Compléter votre profil"}
        </h1>

        {user.role === "pro" && (
          <Button
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() =>
              setTabs((prev) => moveSelectedTabToTop("store", prev))
            }
          >
            Accès Pro
          </Button>
        )}
        <LogoutButtonText />
      </div>
      <Separator />
      <div className="mt-4 grid grid-cols-1  gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-bold dark:text-white">Email:</p>
          <p className="dark:text-gray-300">{user.email}</p>
        </div>
        <div>
          <p className="font-bold dark:text-white">Adresse:</p>
          <p className="dark:text-gray-300">
            {user.adress?.line1
              ? `${user.adress.line1}, ${user.adress.postalCode} ${user.adress.city}`
              : "Non renseigné"}
          </p>
        </div>
        <div>
          <p className="font-bold dark:text-white">Téléphone:</p>
          <UserPhone phone={user.phone} />
        </div>
      </div>
      <Button
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() =>
          setTabs((prev) => moveSelectedTabToTop("settings", prev))
        }
        variant={"expandIcon"}
        iconPlacement="right"
        Icon={PencilLine}
      >
        Modifier le profil
      </Button>
    </div>
  );
};

export default ProfilTab;
