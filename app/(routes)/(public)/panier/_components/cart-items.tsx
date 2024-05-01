"use client";
import useCart from "@/hooks/use-cart";
import { AnimatePresence, motion } from "framer-motion";
import CartItem from "@/components/cart-item";
import { useEffect, useState } from "react";

const CartItems = () => {
  const cart = useCart();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="lg:col-span-7">
      {cart.items.length === 0 ? (
        <p className="text-secondary-foreground ">
          Aucun produit dans le panier
        </p>
      ) : (
        <ul>
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.li
                key={item.id}
                layout
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -100, x: 0 }}
                transition={{
                  layout: { type: "tween" },
                  animate: { duration: 1 },
                }}
                className="mb-4 flex rounded-lg border border-border bg-gradient-to-bl from-slate-50/50 from-[37.5%] to-blue-50/60 to-[87.5%] p-1  @container dark:from-neutral-900/50 dark:to-blue-50/10 sm:border-2 sm:p-2"
              >
                <CartItem data={item} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
};

export default CartItems;
