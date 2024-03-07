"use client";

import { ShoppingBag, User2 } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import Link from "next/link";
import { LoginButton } from "../auth/auth-button";
import { useSession } from "next-auth/react";

const NavbarAction = () => {
  const session = useSession();

  return (
    <div className="ml-4 flex items-center gap-x-2 sm:gap-x-4 ">
      {session.data ? (
        <Link
          href={
            session.data?.user.role === "admin" ? "/admin" : "/dashboard-user"
          }
          className="group flex items-center justify-center rounded-full border bg-primary p-2 text-primary-foreground shadow-md transition hover:rounded-full hover:bg-accent hover:text-accent-foreground"
        >
          <User2 className="h-6 w-6 duration-300 ease-linear group-hover:scale-150 " />
        </Link>
      ) : (
        <LoginButton />
      )}
      <ThemeToggle />
    </div>
  );
};

export default NavbarAction;
