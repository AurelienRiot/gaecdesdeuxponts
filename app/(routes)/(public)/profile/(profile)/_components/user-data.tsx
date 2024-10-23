"use client";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { addressFormatter } from "@/lib/utils";
import Link from "next/link";
import { formatPhoneNumber } from "react-phone-number-input";
import { useUserQuery } from "../../_components/user-query";

export const UserName = () => {
  const { data: user } = useUserQuery();

  return !user ? (
    <Skeleton className="h-6 w-40" />
  ) : (
    <>
      <span>{user.name || "Compléter votre profile"}</span>
      {user?.role === "pro" && <span>{user.company ? ` - ${user.company}` : ""}</span>}
    </>
  );
};

export const UserEmail = () => {
  const { data: user } = useUserQuery();

  return !user ? <Skeleton className="h-6 w-40" /> : user.email;
};

export const UserPhone = () => {
  const { data: user } = useUserQuery();

  return !user ? <Skeleton className="h-6 w-40" /> : user.phone ? formatPhoneNumber(user.phone) : "Non renseigné";
};

export const UserAddress = () => {
  const { data: user } = useUserQuery();

  const address = user?.address ? addressFormatter(user.address, false) : null;

  return !user ? <Skeleton className="h-6 w-40" /> : address ? address : "Non renseigné ";
};

export const ProButton = () => {
  const { data: user } = useUserQuery();

  return (
    user?.role === "pro" && (
      <Button asChild>
        <Link href="/profile/produits-pro">Accès Pro</Link>
      </Button>
    )
  );
};
