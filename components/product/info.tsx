"use client";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import type { ProductWithOptionsAndMain } from "@/types";
import Link from "next/link";
import type { OptionsArray } from ".";
import DisplayMinimalTiptapEditor from "../minimal-tiptap/display-minimal-tiptap";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import AddToCartButton, { BulkQuantity, CustomQuantityAddToCart } from "./cart-buttons";

interface InfoProps {
  product: ProductWithOptionsAndMain;
  sameProducts: ProductWithOptionsAndMain[];
  optionsArray: OptionsArray;
  scroll?: boolean;
}

const Info: React.FC<InfoProps> = ({ sameProducts, scroll, product, optionsArray }) => {
  const { quantities } = useCart();
  const value = product.price;
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
      <Separator className="w-48" />
      <div className="mt-3 items-end justify-between">
        <p className="text-2xl text-gray-900 dark:text-white">
          <Currency value={value} unit={product.unit} />
        </p>
      </div>
      {!!product.description && (
        <>
          <Separator className="w-48" />

          <div className="flex max-w-2xl flex-col gap-y-6">
            <div className="flex items-center gap-x-4">
              <p>{product.description}</p>
            </div>
          </div>
        </>
      )}
      {optionsArray.length > 0 && (
        <>
          <Separator className="w-48" />

          <OptionsDisplay optionsArray={optionsArray} product={product} sameProducts={sameProducts} />
        </>
      )}
      <Separator className="w-48" />

      {product.options.length > 0 && product.options[0].value === "Vrac" ? (
        <BulkQuantity product={product} />
      ) : quantities[product.id] ? (
        <CustomQuantityAddToCart data={product} />
      ) : (
        <AddToCartButton type="text" data={product} />
      )}

      <DisplayMinimalTiptapEditor
        value={product.product.productSpecs}
        className={scroll ? "h-[500px] overflow-scroll hide-scrollbar" : "p-0"}
      />
    </div>
  );
};

export default Info;

const OptionsDisplay = ({ optionsArray, product, sameProducts }: InfoProps) => {
  return (
    <div>
      {optionsArray.map((option, index) => (
        <div key={option.name + index}>
          <h3 className="mb-4 mt-8 text-lg">{option.name}</h3>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value, i) => {
              const isActive = value === product.options[index].value;
              const productOption = product.options.map((o, idx) => ({
                name: o.name,
                value: idx < index ? o.value : null,
              }));
              const selectedProduct = sameProducts.some((p) => {
                return productOption.every((o, idx) => {
                  return o.value
                    ? o.value === p.options.find((op) => op.name === o.name)?.value
                    : idx === index
                      ? value === p.options.find((op) => op.name === o.name)?.value
                      : true;
                });
              });

              const isAvailable = index === 0 || selectedProduct;

              let productUrl = "?";
              productOption.forEach((option, idx) => {
                if (option.value) {
                  productUrl += `${option.name}=${encodeURIComponent(option.value)}&`;
                } else if (idx === index) {
                  productUrl += `${option.name}=${encodeURIComponent(value)}&`;
                }
              });

              // if (value === "Aucun") {
              //   return null;
              // }

              return (
                <Link key={value + i} aria-disabled={!isAvailable} href={isAvailable ? productUrl : "#"} scroll={false}>
                  <Badge variant={isActive ? "green" : !isAvailable ? "disable" : "outline"} className="py-1">
                    {value}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
