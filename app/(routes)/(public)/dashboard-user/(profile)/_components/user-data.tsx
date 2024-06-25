"use client";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/user-context";
import { addressFormatter } from "@/lib/utils";
import Link from "next/link";
import { formatPhoneNumber } from "react-phone-number-input";

export const UserName = () => {
  const { user } = useUserContext();

  return !user ? (
    <Skeleton className="h-6 w-40" />
  ) : (
    <>
      <span>{user.name || "Compléter votre profil"}</span>
      {user?.role === "pro" && <span>{user.company ? ` - ${user.company}` : ""}</span>}
    </>
  );
};

export const UserEmail = () => {
  const { user } = useUserContext();

  return !user ? <Skeleton className="h-6 w-40" /> : user.email;
};

export const UserPhone = () => {
  const { user } = useUserContext();

  return !user ? <Skeleton className="h-6 w-40" /> : user.phone ? formatPhoneNumber(user.phone) : "Non renseigné";
};

export const UserAddress = () => {
  const { user } = useUserContext();

  const address = user?.address ? addressFormatter(user.address, false) : null;

  return !user ? <Skeleton className="h-6 w-40" /> : address ? address : "Non renseigné ";
};

export const ProButton = () => {
  const { user } = useUserContext();

  return (
    user?.role === "pro" && (
      <Button asChild>
        <Link href="/dashboard-user/produits-pro">Accès Pro</Link>
      </Button>
    )
  );
};
