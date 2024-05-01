"use client";

import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { MouseEventHandler } from "react";
import useCart from "@/hooks/use-cart";
import Link from "next/link";
import { ProductWithCategory } from "@/types";
import { PlateVis } from "./plate-vis";
import { Badge } from "./ui/badge";

interface InfoProps {
  data: ProductWithCategory;
  scroll?: boolean;
}

const Info: React.FC<InfoProps> = ({ data, scroll }) => {
  const cart = useCart();

  const value = data.price;

  const url = data.isPro ? `/dashboard-user/produits-pro/` : `/product/`;

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
  };

  return (
    <div>
      <Link
        href={url + encodeURIComponent(data.name)}
        className="text-3xl font-bold text-gray-900 dark:text-white"
      >
        {data.name}
      </Link>
      <div className="mt-3 items-end justify-between">
        <p className="text-2xl text-gray-900 dark:text-white">
          <Currency value={value} classNameLogo="w-6 h-6" />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <p>{data.description}</p>
        </div>
      </div>
      <hr className="my-4" />
      {/* {linkProducts.length > 0 && (
        <>
          <h2 className="mb-4 mt-8 text-xl">Produits liées</h2>
          <div className="flex flex-wrap gap-1">
            {linkProducts.map((product) => {
              return (
                <Badge key={product.id}>
                  <Link
                    className="py-1"
                    href={url + encodeURIComponent(product.name)}
                  >
                    {product.name}
                  </Link>
                </Badge>
              );
            })}
          </div>
          <hr className="my-4" />
        </>
      )} */}
      <div className="mt-10 flex items-center gap-x-3">
        <Button
          variant="rounded"
          className="flex items-center gap-x-2 hover:scale-105"
          onClick={onAddToCart}
        >
          Ajouter au panier
          <ShoppingCart />
        </Button>
      </div>

      <PlateVis
        value={data.productSpecs}
        className={scroll ? "h-[500px] overflow-scroll hide-scrollbar" : ""}
      />
    </div>
  );
};

export default Info;
