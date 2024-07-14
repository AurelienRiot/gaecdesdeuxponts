"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type AnchorHTMLAttributes, forwardRef } from "react";

const AuthLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    const session = useSession();

    return (
      <Button variant={"outline"} className={cn("text-base", className)}>
        <Link
          {...props}
          href={!session.data ? "/login" : session.data.user.role === "admin" ? "/admin/orders" : "/dashboard-user"}
          ref={ref}
          prefetch={false}
        >
          {session.status === "authenticated" ? "Mon compte" : "Se connecter"}
        </Link>
      </Button>
    );
  },
);

AuthLink.displayName = "AuthLink";

export default AuthLink;
