"use client";
import { Button } from "@/components/ui/button";
import useIsComponentMounted from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AnchorHTMLAttributes, forwardRef } from "react";

const AuthLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => {
  const session = useSession();

  // const isMounted = useIsComponentMounted();

  // if (!isMounted) {
  //   return (
  //     <Button
  //       variant={"outline"}
  //       className={cn("text-base", className)}
  //       asChild
  //     >
  //       <Link {...props} href={"#"} ref={ref}>
  //         {"Se connecter"}
  //       </Link>
  //     </Button>
  //   );
  // }

  return (
    <Button variant={"outline"} className={cn("text-base", className)}>
      <Link
        {...props}
        href={
          !session.data
            ? "/login"
            : session.data.user.role === "admin"
              ? "/admin"
              : "/dashboard-user"
        }
        ref={ref}
      >
        {session.status === "authenticated" ? "Mon compte" : "Se connecter"}
      </Link>
    </Button>
  );
});

AuthLink.displayName = "AuthLink";

export default AuthLink;
