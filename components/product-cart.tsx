"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { ProductWithCategoryAndImages } from "@/types";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { FaInfo } from "react-icons/fa";
import { VisibleElement } from "./animations/visible-element";

interface ProductCartProps {
  data: ProductWithCategoryAndImages;
  url?: string;
}

const ProductCart: React.FC<ProductCartProps> = ({
  data,
  url = "/product/",
}) => {
  const router = useRouter();
  const cart = useCart();

  const value = data.price;

  const handleClick = () => {
    router.push(url + data?.id);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem(data);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group m-2 cursor-pointer space-y-4 rounded-xl border bg-secondary p-3 "
    >
      <VisibleElement
        onClick={handleClick}
        className="relative aspect-square rounded-xl bg-white before:absolute before:inset-0 before:z-10 before:rounded-xl before:bg-black/20 before:opacity-0 before:duration-300 before:ease-linear before:animate-in group-hover:before:opacity-100 "
      >
        <Image
          src={data?.images?.[0].url}
          fill
          sizes="80vw"
          alt="Image"
          className="aspect-square rounded-xl object-cover "
        />
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
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-foreground" />}
            />
          </div>
        </div>
      </VisibleElement>
      <div onClick={handleClick}>
        <p className="text-lg font-semibold text-primary">{data.name}</p>
        <p className="text-sm text-secondary-foreground">
          {data.category.name}
        </p>
      </div>
      <div className="flex items-center justify-between text-primary">
        <Currency value={value} />
      </div>
    </motion.div>
  );
};

export default ProductCart;
