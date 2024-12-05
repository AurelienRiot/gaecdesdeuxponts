"use client";

import { Button } from "@/components/ui/button";
import { useOptionModal } from "./option-modal";
import { useProductModal } from "./product-modal";
import type { ModalOptionType, OptionFormValues, ProductFormValues } from "./product-schema";
import { Archive, PlusCircle, Star } from "lucide-react";
import { currencyFormatter } from "@/lib/utils";
import { DisplayProductIcon } from "@/components/product";
import { createId } from "@/lib/id";

export function ProductButton({ product, index }: { product: ProductFormValues; index: number }) {
  const { setProduct, setIsProductModalOpen } = useProductModal();

  return (
    <Button
      id={`product-${index}`}
      onClick={() => {
        setProduct(product);
        setIsProductModalOpen(true);
      }}
      className={`mr-2 mb-2 h-auto py-2 flex flex-col items-start text-left ${product.options.some((option) => option.value === "") ? "bg-destructive" : "bg-background"}`}
      variant={"outline"}
    >
      <div className="flex items-center w-full gap-2">
        <DisplayProductIcon icon={product.icon} />
        <span className="font-bold">{product.name}</span>
        <span className="ml-auto text-sm">{currencyFormatter.format(product.price)}</span>
      </div>
      <div className={`text-xs mt-1 `}>{product.options.map((option) => option.value).join(" / ")}</div>
      <div className="flex items-center mt-1 text-xs">
        {product.isArchived && <Archive className="w-3 h-3 mr-1" />}
        {product.isFeatured && <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />}
        <span className="text-gray-500">
          {product.description.slice(0, 30)}
          {product.description.length > 30 && "..."}
        </span>
      </div>
    </Button>
  );
}

export function NewProductButton({
  index,
  mainProductId,
  options,
}: { index: number; mainProductId: string; options: { index: number; name: string }[] | null }) {
  const { setProduct, setIsProductModalOpen } = useProductModal();

  function onNewProduct() {
    const newProduct: ProductFormValues = {
      id: createId("product"),
      description: "",
      imagesUrl: [],
      isArchived: true,
      index,
      isFeatured: false,
      mainProductId,
      name: "",
      options: options ? options.map((o) => ({ index: o.index, name: o.name, value: "" })) : [],
      price: 0,
      stocks: [],
      tax: 1.055,
      unit: undefined,
      icon: null,
    };
    setProduct(newProduct);
    setIsProductModalOpen(true);
  }

  return (
    <Button
      onClick={onNewProduct}
      className="mr-2 mb-2 h-auto py-2 flex flex-col items-start text-left"
      variant={"outline"}
    >
      <div className="flex items-center w-full gap-2">
        <PlusCircle className="size-5" />
        <span className="font-bold">Nouveau produit</span>
      </div>
    </Button>
  );
}

export function OptionButton({ option }: { option: ModalOptionType }) {
  const { setOption, setIsOptionModalOpen } = useOptionModal();

  return (
    <Button
      variant={"outline"}
      onClick={() => {
        setOption(option);
        setIsOptionModalOpen(true);
      }}
    >
      {option.name}
    </Button>
  );
}

export function NewOptionButton({ index }: { index: number }) {
  const { setOption, setIsOptionModalOpen } = useOptionModal();

  function onNewOption() {
    const newOption: ModalOptionType = {
      index,
      optionIds: [],
      name: "",
    };
    setOption(newOption);
    setIsOptionModalOpen(true);
  }

  return (
    <Button
      onClick={onNewOption}
      className="mr-2 mb-2 h-auto py-2 flex flex-col items-start text-left"
      variant={"outline"}
    >
      <div className="flex items-center w-full gap-2">
        <PlusCircle className="size-5" />
        <span className="font-bold">Nouvelle option</span>
      </div>
    </Button>
  );
}
