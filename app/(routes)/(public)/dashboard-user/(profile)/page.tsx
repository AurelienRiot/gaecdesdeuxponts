import { LogoutButtonText } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PencilLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserAddress, UserEmail, UserName, UserPhone } from "./_components/user-data";

export const metadata: Metadata = {
  title: "Profil utilisateur",
  description: "Profil utilisateur Laiterie du Pont Robert",
};

const ProfilTab = async () => {
  return (
    <div className="w-full space-y-10 p-6">
      <div className="flex flex-col items-center justify-between gap-y-6 pb-4 sm:flex-row">
        <h1 className="text-2xl font-semibold capitalize">
          <UserName />
        </h1>

        {/* <ProButton /> */}
        <LogoutButtonText />
      </div>
      <Separator />
      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-bold dark:text-white">Email:</p>
          <p className="dark:text-gray-300">
            {" "}
            <UserEmail />
          </p>
        </div>
        <div>
          <p className="font-bold dark:text-white">Adresse:</p>

          <p className="dark:text-gray-300">
            <UserAddress />
          </p>
        </div>
        <div>
          <p className="font-bold dark:text-white">Téléphone:</p>

          <p className="dark:text-gray-300">
            <UserPhone />
          </p>
        </div>
      </div>

      <Button asChild variant={"expandIcon"} iconPlacement="right" Icon={PencilLine}>
        <Link href="/dashboard-user/parametres">Modifier votre profil</Link>
      </Button>
    </div>
  );
};

export default ProfilTab;
