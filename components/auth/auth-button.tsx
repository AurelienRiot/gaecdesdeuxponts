"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const LoginButton = (
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
) => {
  return (
    <Button
      className={cn(
        "bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground",
        props.className,
      )}
      title="Se connecter"
      asChild
    >
      <Link href={"/login"} {...props}>
        {" "}
        <LogIn className="h-6 w-6 transition-all duration-300 " />{" "}
      </Link>
    </Button>
  );
};

export const LogoutButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Button
      title="Se deconnecter"
      onClick={() => signOut({ callbackUrl: "/" })}
      {...props}
    >
      <LogOut className="h-6 w-6" />
    </Button>
  );
};
export const LogoutButtonText = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <Button
      title="Se deconnecter"
      onClick={() => signOut({ callbackUrl: "/" })}
      {...props}
    >
      Déconnexion
    </Button>
  );
};
