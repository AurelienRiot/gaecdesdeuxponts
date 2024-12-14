"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

const AuthLink = ({
  className,
  callbackUrl,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { callbackUrl?: string }) => {
  const session = useSession();
  return (
    <Link
      {...props}
      className={cn(buttonVariants({ variant: "outline" }), "text-base", className)}
      href={
        !session.data?.user
          ? `/login${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`
          : session.data.user.role === "admin"
            ? "/admin/calendar"
            : "/profile"
      }
    >
      {session.data?.user ? "Mon compte" : "Se connecter"}
    </Link>
  );
};

export default AuthLink;
