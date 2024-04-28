"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuthLink = () => {
  const session = useSession();
  return (
    <Button variant={"outline"} className="hidden text-base sm:block" asChild>
      <Link
        href={
          !session.data
            ? "/login"
            : session.data.user.role === "admin"
              ? "/admin"
              : "/dashboard-user"
        }
      >
        {session.status === "unauthenticated" ? "Se connecter" : "Mon compte"}
      </Link>
    </Button>
  );
};

export default AuthLink;
