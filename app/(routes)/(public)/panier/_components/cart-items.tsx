"use client";
import CartItem from "@/components/cart-item";
import { CartItemSkeleton } from "@/components/skeleton-ui/cart-item-skeleton";
import useCart from "@/hooks/use-cart";
import useIsComponentMounted from "@/hooks/use-mounted";
import { AnimatePresence, motion } from "framer-motion";

const CartItems = () => {
  const cart = useCart();

  const isMounted = useIsComponentMounted();

  return (
    <div className="lg:col-span-7">
      {cart.items.length === 0 && isMounted ? (
        <p className="text-secondary-foreground ">
          Aucun produit dans le panier
        </p>
      ) : isMounted ? (
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
                className="from-grey-50/50 mb-4 flex rounded-lg border border-border bg-gradient-to-br from-[37.5%] to-green-50/60 to-[87.5%] p-1  @container dark:from-neutral-900/50 dark:to-blue-50/10 sm:border-2 sm:p-2"
              >
                <CartItem data={item} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        Array(4)
          .fill(null)
          .map((_, i) => (
            <div
              key={i}
              className="from-grey-50/50 mb-4 flex rounded-lg border border-border bg-gradient-to-br from-[37.5%] to-green-50/60 to-[87.5%] p-1  @container dark:from-neutral-900/50 dark:to-blue-50/10 sm:border-2 sm:p-2"
            >
              <CartItemSkeleton />
            </div>
          ))
      )}
    </div>
  );
};

export default CartItems;
