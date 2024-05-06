"use client";

import useCart from "@/hooks/use-cart";
import { ProductWithOptionsAndMain } from "@/types";
import { Button, IconButton } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const AddToCartButton = ({
  data,
  quantity,
  type,
  className,
  iconClassName,
}: {
  data: ProductWithOptionsAndMain;
  quantity?: number;
  className?: string;
  iconClassName?: string;
  type: "text" | "icon";
}) => {
  const { addItem } = useCart();

  const onAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    addItem(
      {
        ...data,
        imagesUrl: data.imagesUrl[0] ? data.imagesUrl : data.product.imagesUrl,
      },
      quantity,
    );
  };

  if (type === "icon") {
    return (
      <IconButton
        className={cn(
          "z-20 size-10 sm:opacity-0 sm:group-hover:opacity-100",
          className,
        )}
        iconClassName={iconClassName}
        title="Ajouté au panier"
        onClick={onAddToCart}
        Icon={ShoppingCart}
      />
    );
  }
  return (
    <Button
      variant="rounded"
      className={cn("flex items-center gap-x-2 hover:scale-105", className)}
      onClick={onAddToCart}
    >
      Ajouter au panier
      <ShoppingCart className={iconClassName} />
    </Button>
  );
};

export default AddToCartButton;
