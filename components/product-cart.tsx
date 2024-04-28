"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import { useCategoriesContext } from "@/context/categories-context";
import useCart from "@/hooks/use-cart";
import { ProductWithImages } from "@/types";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";
import { FaInfo } from "react-icons/fa";

interface ProductCartProps {
  data: ProductWithImages;
}

const ProductCart: React.FC<ProductCartProps> = ({ data }) => {
  const router = useRouter();
  const cart = useCart();
  const { categories } = useCategoriesContext();
  if (!categories) return null;
  const category = categories.find((c) => c.id === data.categoryId);
  if (!category) return null;
  const url = data.isPro ? `/dashboard-user/produits-pro/` : `/product/`;

  const value = data.price;

  const handleClick = () => {
    router.push(url + encodeURIComponent(data.name));
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem({ ...data, category: category });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group  flex w-full cursor-pointer flex-col justify-between gap-4 rounded-xl border bg-secondary p-3 "
    >
      <div
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
              onClick={handleClick}
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
      </div>
      <div>
        <Link
          href={url + encodeURIComponent(data.name)}
          className="block text-lg font-semibold text-primary"
        >
          {data.name}
        </Link>
        {/* <Link
          href={`/category/${category.name}`}
          className="block text-sm text-secondary-foreground"
        >
          {category.name}
        </Link> */}
      </div>
      <div className="flex items-center justify-between text-primary">
        <Currency value={value} />
      </div>
    </motion.div>
  );
};

export default ProductCart;
