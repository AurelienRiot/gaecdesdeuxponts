"use client";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { ProductWithOptionsAndMain } from "@/types";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { BulkQuantity, CustomQuantityAddToCart } from "./product/cart-buttons";
import { hasOptionWithValue, makeProductUrl } from "./product/product-function";
import { IconButton } from "./ui/button";

interface CartItemProps {
  data: ProductWithOptionsAndMain;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();

  const productUrl = makeProductUrl(
    data.productName,
    data.product.categoryName,
    data.product.isPro,
    data.options,
  );

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
            Icon={X}
            iconClassName="size-4 text-primary"
            className="bg-primary-foreground"
            onClick={onRemove}
            title="Supprimer du panier"
          />
        </div>
        <div className="relative flex h-full flex-col content-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 pr-10 ">
            <Link
              href={productUrl}
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
