"use client";
import { LogoutButtonText } from "@/components/auth/auth-button";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { PencilLine } from "lucide-react";
import { useRouter } from "next/navigation";
import UserPhone from "@/components/user-phone";

const ProfilTab = () => {
  const { user } = useUserContext();
  const router = useRouter();

  const adress = !user
    ? null
    : user.address.length > 0
      ? user.address[0]
      : { line1: "", city: "", country: "", postalCode: "" };

  return (
    <div className="w-full space-y-10  p-6 ">
      <div className="flex flex-col items-center justify-between gap-y-6  pb-4 sm:flex-row">
        <h1 className="text-2xl font-semibold capitalize ">
          {!user ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <>
              <span>{user.name || "Compléter votre profil"}</span>
              {user?.role === "pro" && (
                <span>{user.company ? ` - ${user.company}` : ""}</span>
              )}
            </>
          )}
        </h1>

        {user?.role === "pro" && (
          <Button
            onClick={async () => {
              router.push("/dashboard-user/produits-pro");
            }}
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
          {!user ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <p className="dark:text-gray-300">{user.email}</p>
          )}
        </div>
        <div>
          <p className="font-bold dark:text-white">Adresse:</p>

          {!adress ? (
            <Skeleton className="h-6 w-40" />
          ) : adress.line1 ? (
            <p className="dark:text-gray-300">
              {`${adress.line1}, ${adress.postalCode} ${adress.city}`}
            </p>
          ) : (
            <p className="dark:text-gray-300"> Non renseigné </p>
          )}
        </div>
        <div>
          <p className="font-bold dark:text-white">Téléphone:</p>
          {!user ? (
            <Skeleton className="h-6 w-40" />
          ) : (
            <UserPhone phone={user.phone} />
          )}
        </div>
      </div>

      <Button
        onClick={async () => {
          router.push("/dashboard-user/settings");
        }}
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
