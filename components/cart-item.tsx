"use client";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import useCart from "@/hooks/use-cart";
import { ProductWithOptionsAndMain } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { makeProductUrl } from "./product/main-product-cart";
import { BulkQuantity, CustomQuantityAddToCart } from "./product/cart-buttons";
import { hasOptionWithValue } from "./product/product-function";

interface CartItemProps {
  data: ProductWithOptionsAndMain;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const productUrl = makeProductUrl(data);
  const url = data.product.isPro
    ? `/dashboard-user/produits-pro/category/${data.product.categoryName}`
    : `/category/${data.product.categoryName}`;

  const value = Number(data.price);

  const onRemove = () => {
    cart.removeItem(data.id);
  };

  return (
    <>
      <div className="relative size-24  overflow-clip rounded-md bg-white @sm:size-48 ">
        <Image
          fill
          src={data.imagesUrl[0] ?? data.product.imagesUrl[0]}
          sizes="100%"
          alt="image"
          className="object-contain object-center"
        />
      </div>
      <div className="@sm::ml-6 relative ml-4 flex flex-1 flex-col justify-between">
        <div className="absolute right-0 top-0 z-10">
          <IconButton
            type="button"
            className="bg-primary-foreground"
            onClick={onRemove}
            icon={<X className="size-4 text-primary" />}
          />
        </div>
        <div className="relative flex h-full flex-col content-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 pr-10 ">
            <Link
              href={url + productUrl}
              className=" font-semibold text-primary @xs:text-lg "
            >
              {data.name}
            </Link>
          </div>
          <Currency value={value} unit={data.unit} />

          {hasOptionWithValue(data.options, "Vrac") ? (
            <BulkQuantity product={data} />
          ) : (
            <CustomQuantityAddToCart data={data} />
          )}
        </div>
      </div>
    </>
  );
};

export default CartItem;
