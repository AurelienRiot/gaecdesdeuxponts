import { OptionsArray } from "@/app/(routes)/admin/products/[productId]/page";
import Currency from "@/components/ui/currency";
import { ProductWithOptionsAndMain } from "@/types";
import Link from "next/link";
import { PlateVis } from "./plate-vis";
import AddToCartButton, {
  CustomQuantityAddToCart,
} from "./product/cart-button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

interface InfoProps {
  product: ProductWithOptionsAndMain;
  sameProducts: ProductWithOptionsAndMain[];
  optionsArray: OptionsArray;
  scroll?: boolean;
}

const Info: React.FC<InfoProps> = ({
  sameProducts,
  scroll,
  product,
  optionsArray,
}) => {
  const value = product.price;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {product.name}
      </h2>
      <Separator className="w-48" />
      <div className="mt-3 items-end justify-between ">
        <p className="text-2xl text-gray-900 dark:text-white">
          <Currency value={value} />
        </p>
      </div>
      {!!product.description && (
        <>
          <Separator className="w-48" />

          <div className="flex flex-col gap-y-6">
            <div className="flex items-center gap-x-4">
              <p>{product.description}</p>
            </div>
          </div>
        </>
      )}
      {optionsArray.length > 0 && (
        <>
          <Separator className="w-48" />

          <OptionsDisplay
            optionsArray={optionsArray}
            product={product}
            sameProducts={sameProducts}
          />
        </>
      )}
      <Separator className="w-48" />

      {product.options.length > 0 && product.options[0].value === "Vrac" ? (
        <CustomQuantityAddToCart
          data={product}
          custom={true}
          onChange={() => {
            toast.success("Produit ajouté au panier");
          }}
        />
      ) : (
        <AddToCartButton type="text" data={product} />
      )}

      <PlateVis
        value={product.product.productSpecs}
        className={scroll ? "h-[500px] overflow-scroll hide-scrollbar" : ""}
      />
    </div>
  );
};

export default Info;

const OptionsDisplay = ({ optionsArray, product, sameProducts }: InfoProps) => {
  const url = product.product.isPro
    ? `/dashboard-user/produits-pro/category/${product.product.categoryName}`
    : `/category/${product.product.categoryName}`;
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
              const selectedProduct = sameProducts.find((p) => {
                return productOption.every((o, idx) => {
                  return o.value
                    ? o.value ===
                        p.options.find((op) => op.name === o.name)?.value
                    : p.options.find((op) => op.name === o.name)?.value ===
                        value;
                });
              });

              const isAvailable = index === 0 || selectedProduct;

              let productUrl = `/product/${encodeURIComponent(product.productName)}?`;
              productOption.forEach((option, idx) => {
                option.value
                  ? (productUrl += `${option.name}=${encodeURIComponent(option.value)}&`)
                  : idx === index
                    ? (productUrl += `${option.name}=${encodeURIComponent(value)}&`)
                    : null;
              });

              return (
                <Badge
                  key={value + i}
                  variant={
                    isActive ? "green" : !isAvailable ? "disable" : "outline"
                  }
                  className="py-1"
                >
                  {isAvailable ? (
                    <Link href={url + productUrl}>{value}</Link>
                  ) : (
                    <span aria-disabled>{value}</span>
                  )}
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
