import { getSessionUser } from "@/actions/get-user";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

const AuthLink = async ({
  className,
  callbackUrl,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { callbackUrl?: string }) => {
  const user = await getSessionUser();
  return (
    <Link
      {...props}
      className={cn(buttonVariants({ variant: "outline" }), "text-base", className)}
      href={
        !user
          ? `/login${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`
          : user.role === "admin"
            ? "/admin/calendar"
            : "/profile"
      }
    >
      {user ? "Mon compte" : "Se connecter"}
    </Link>
  );
};

export default AuthLink;
