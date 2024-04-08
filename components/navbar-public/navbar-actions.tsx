"use client";

import useCart from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import CartItem from "../cart-item";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { cn } from "@/lib/utils";

const NavbarAction = ({ className }: { className?: string }) => {
  const session = useSession();

  return (
    <div
      className={cn(
        "ml-4 flex items-center gap-x-2 py-2 sm:gap-x-4",
        className,
      )}
    >
      <AuthNavButton session={session} />

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
    <Button
      variant={"rounded"}
      asChild
      className="relative bg-background px-3	 text-foreground  "
    >
      <Link
        aria-label="Se connecter"
        href={
          !session.data
            ? "/login"
            : session.data.user.role === "admin"
              ? "/admin"
              : "/dashboard-user"
        }
      >
        <User2 size={20} />
      </Link>
    </Button>
  );
};

export default NavbarAction;

const CartIcon = forwardRef<HTMLButtonElement, { qty: number }>(
  ({ qty, ...props }, ref) => {
    return (
      <Button
        variant={"outline"}
        className="group relative border-0 px-3	hover:bg-background hover:text-foreground/80   "
        ref={ref}
        {...props}
      >
        <ShoppingCart size={20} className="group-hover:text-foreground/80" />
        <span className="absolute -right-2 -top-1  flex h-5  w-5 items-center justify-center rounded-full bg-foreground font-sans text-xs tabular-nums text-background shadow-md group-hover:bg-foreground/80 group-hover:text-background/80">
          {qty}
        </span>
      </Button>
    );
  },
);
CartIcon.displayName = "CartIcon";

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
    return <CartIcon qty={0} />;
  }
  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <CartIcon qty={totalQuantity} />
      </SheetTrigger>
      <SheetContent className="min-w-[25vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <Link
              onClick={() => setIsOpen(false)}
              href="/panier"
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
