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
              className="flex p-1 mb-4 border rounded-lg sm:border-2 sm:p-2 bg-card border-border"
            >
              <CartItem data={item} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default CartItems;
