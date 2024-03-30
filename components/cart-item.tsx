"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { ProductWithCategoryAndImages } from "@/types";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  data: ProductWithCategoryAndImages;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const value = Number(data.price);
  const quantity = cart.quantities[data.id];
  const url = data.isPro ? `/pro/product/` : `/product/`;

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  const handleIncrement = () => {
    cart.addOneItem(data.id);
  };
  const handleDecrement = () => {
    cart.removeOneItem(data.id);
  };

  return (
    <>
      <div className="relative h-24 w-24  overflow-hidden rounded-md bg-white sm:h-48 sm:w-48">
        <Image
          fill
          src={data.images[0].url}
          sizes="100%"
          alt="image"
          className="object-cover object-center"
        />
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="absolute right-0 top-0 z-10">
          <IconButton
            className="bg-primary-foreground"
            onClick={onRemove}
            icon={<X size={15} className="text-primary" />}
          />
        </div>
        <div className="relative content-center sm:gap-x-6">
          <div className="flex justify-between ">
            <Link
              href={url + encodeURIComponent(data.name)}
              className="pr-10 text-lg font-semibold text-primary"
            >
              {data.name}
            </Link>
          </div>
          <Currency value={value} /> <br />
          <div className="items-left flex gap-2 sm:flex-col ">
            Quantité:
            <div className="flex items-center gap-2 tabular-nums	">
              <IconButton
                className="h-5 w-5 bg-primary-foreground p-0.5  "
                onClick={handleDecrement}
                icon={<Minus size={20} className="stroke-2 font-bold" />}
              />
              {quantity}
              <IconButton
                className="h-5 w-5 bg-primary-foreground p-0.5 "
                onClick={handleIncrement}
                icon={<Plus size={20} className="stroke-2 font-bold" />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
