"use client";

import useCart from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, User2, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { LoginButton } from "../auth/auth-button";
import CartItem from "../cart-item";
import { ThemeToggle } from "../theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const NavbarAction = () => {
  const session = useSession();

  return (
    <div className="ml-4 flex items-center gap-x-2 py-2 sm:gap-x-4">
      {session.status !== "loading" ? (
        <AuthNavButton session={session} />
      ) : null}

      <ThemeToggle />
      <CartButton />
    </div>
  );
};

const AuthNavButton = ({
  session,
}: {
  session: ReturnType<typeof useSession>;
}) => {
  return (
    <>
      {session.data ? (
        <Link
          href={
            session.data?.user.role === "admin" ? "/admin" : "/dashboard-user"
          }
          className="dark:border-1 group flex items-center justify-center  rounded-full bg-background p-2 text-primary-foreground shadow-md transition  hover:rounded-full dark:border dark:border-foreground"
        >
          {!session.data.user.image ? (
            <User2 className="h-6 w-6 duration-300 ease-linear group-hover:scale-150 " />
          ) : (
            <Avatar className="h-6 w-6  duration-300 ease-linear group-hover:scale-150">
              {" "}
              <AvatarImage src={session.data.user.image} alt="avatar" />{" "}
              <AvatarFallback className="bg-primary">
                <User2 className="h-6 w-6" />
              </AvatarFallback>{" "}
            </Avatar>
          )}
        </Link>
      ) : (
        <LoginButton />
      )}
    </>
  );
};

export default NavbarAction;

export const CartButton = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  const totalQuantity = Object.values(cart.quantities).reduce((total, qte) => {
    return total + qte;
  }, 0);

  if (!isMounted) {
    return (
      <Button
        variant={"rounded"}
        className="relative bg-primary-foreground px-3	 text-primary shadow-md"
      >
        <ShoppingBag size={20} />
        <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs tabular-nums text-primary-foreground shadow-md">
          0
        </span>
      </Button>
    );
  }
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"rounded"}
          className="relative border-0 	bg-primary-foreground px-3  text-primary shadow-md   "
        >
          <ShoppingBag size={20} />
          <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs tabular-nums text-primary-foreground shadow-md">
            {totalQuantity}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Link
              onClick={() => setIsOpen(false)}
              href="/cart"
              className="mt-6 flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {" "}
              Passer commande{" "}
              <HiOutlineExternalLink className="h-4 w-4 shrink-0" />
            </Link>
          </SheetTitle>
          <SheetDescription>Contenue de votre panier</SheetDescription>
        </SheetHeader>

        <div className="lg:col-span-7">
          {cart.items.length === 0 && (
            <p className="text-secondary-foreground ">
              Aucun produit dans le panier
            </p>
          )}
          <ul>
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    layout: { type: "tween" },
                    animate: { duration: 1 },
                  }}
                  className="mb-4 flex rounded-lg border border-border bg-card p-1 sm:border-2 sm:p-2"
                >
                  <CartItem data={item} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};
