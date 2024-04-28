"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AuthLink = ({ className }: { className?: string }) => {
  const session = useSession();
  return (
    <Button variant={"outline"} className={cn("text-base", className)} asChild>
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
