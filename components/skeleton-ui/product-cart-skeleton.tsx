"use client";

import IconButton from "@/components/ui/icon-button";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { FaInfo } from "react-icons/fa";
import { Skeleton } from "./skeleton";

const ProductCart = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group m-2 cursor-pointer space-y-4 rounded-xl border bg-secondary p-3 "
    >
      <div className="relative aspect-square rounded-xl bg-white before:absolute before:inset-0 before:z-10 before:rounded-xl before:bg-black/20 before:opacity-0 before:duration-300 before:ease-linear before:animate-in group-hover:before:opacity-100 ">
        <Skeleton className=" h-full w-full rounded-xl"></Skeleton>
        <div className="absolute bottom-5 w-full px-6  ">
          <div className="flex justify-center gap-x-6">
            <IconButton
              className="z-20 sm:opacity-0 sm:group-hover:opacity-100"
              title="Aperçue"
              icon={<FaInfo size={20} className="text-foreground" />}
            />
            <IconButton
              className="z-20 sm:opacity-0 sm:group-hover:opacity-100"
              title="Ajouté au panier"
              icon={<ShoppingCart size={20} className="text-foreground" />}
            />
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-primary">
          <Skeleton as="span" className="h-4 w-24" />
        </p>
        <p className="text-sm text-secondary-foreground">
          <Skeleton as="span" className="h-4 w-20" />
        </p>
      </div>
      <div className="flex items-center justify-between text-primary">
        <Skeleton as="span" className="h-4 w-12" />
      </div>
    </motion.div>
  );
};

export default ProductCart;
