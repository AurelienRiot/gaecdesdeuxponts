"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type AnchorHTMLAttributes, forwardRef } from "react";

const AuthLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { callbackUrl?: string }>(
  ({ className, callbackUrl, ...props }, ref) => {
    const session = useSession();
    return (
      <Button variant={"outline"} className={cn("text-base", className)}>
        <Link
          {...props}
          href={
            !session.data
              ? `/login?${callbackUrl ? `callbackUrl=${callbackUrl}` : ""}`
              : session.data.user.role === "admin"
                ? "/admin/calendar"
                : "/profile"
          }
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
