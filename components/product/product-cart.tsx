import Currency from "@/components/ui/currency";
import type { ProductWithOptionsAndMain } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { IconButton } from "../ui/button";
import AddToCartButton, { BulkQuantity } from "./cart-buttons";
import { hasOptionWithValue, makeProductUrl } from "./product-function";
import { FaInfo } from "../react-icons";

interface ProductCartProps {
  data: ProductWithOptionsAndMain;
}

const ProductCart: React.FC<ProductCartProps> = ({ data }) => {
  const productUrl = makeProductUrl({
    productName: data.productName,
    categoryName: data.product.categoryName,
    isPro: data.product.isPro,
    options: data.options,
  });

  const value = data.price;

  return (
    <div className="group flex w-52 cursor-pointer flex-col justify-between gap-4 rounded-xl border bg-secondary p-3 transition-transform hover:scale-105  ">
      <div className="flex flex-col ">
        <Link
          href={productUrl}
          className="relative aspect-square h-44 rounded-xl bg-white before:absolute before:inset-0 before:z-10 before:rounded-xl before:bg-black/20 before:opacity-0 before:duration-300 before:ease-linear before:animate-in group-hover:before:opacity-100 dark:bg-slate-700 "
        >
          <Image
            src={data.imagesUrl[0] ?? data.product.imagesUrl[0]}
            width={176}
            height={176}
            alt="Image"
            className="mx-auto aspect-square rounded-xl object-contain"
          />
          <div className="absolute bottom-5 w-full px-6  ">
            <div className="flex justify-center gap-x-6">
              <IconButton
                className="z-20 size-10 sm:opacity-0 sm:group-hover:opacity-100"
                title="Aperçue"
                Icon={FaInfo}
              />
            </div>
          </div>
        </Link>
        <Link
          href={productUrl}
          className=" mt-2 text-xl  font-semibold text-primary hover:underline hover:underline-offset-2"
        >
          {data.name}
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {data.options.map((option) => (
          <Badge key={option.name} variant={"green"} className="w-fit">
            <span>
              {`${option.name} : `}
              <strong>{option.value}</strong>
            </span>
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 text-primary">
        <Currency className="text-lg" value={value || 0} unit={data.unit} />
        {hasOptionWithValue(data.options, "Vrac") ? (
          <BulkQuantity product={data} className="text-xs" iconClassName="hidden" />
        ) : (
          <AddToCartButton data={data} type="text" iconClassName="hidden" className="text-xs" />
        )}
      </div>
    </div>
  );
};

export default ProductCart;
