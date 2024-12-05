"use client";
import CheckboxForm from "@/components/chekbox-form";
import InputImageModal from "@/components/images-upload/image-modal";
import type { OptionsArray } from "@/components/product";
import { getUnitLabel, hasOptionWithValue } from "@/components/product/product-function";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useServerAction from "@/hooks/use-server-action";
import { getPercentage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Stock, Unit } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import OptionValueForm from "./options-values-form";
import ProductIcon from "./product-icon";
import { productSchema, type ProductFormValues } from "./product-schema";
import { updateProduct } from "../_actions/update-product";
import { createProduct } from "../_actions/create-product";
import { toast } from "sonner";
import { deleteProduct } from "../_actions/delete-product";
import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import { scrollToId } from "@/lib/scroll-to-id";

type ProductModalContextType = {
  product: ProductFormValues | null;
  setProduct: React.Dispatch<React.SetStateAction<ProductFormValues | null>>;
  isProductModalOpen: boolean;
  setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProductModalContext = createContext<ProductModalContextType | undefined>(undefined);

export const ProductModalProvider: React.FC<{
  children: React.ReactNode;
  stocks: Stock[];
  optionsArray: OptionsArray;
}> = ({ children, stocks, optionsArray }) => {
  const [product, setProduct] = useState<ProductFormValues | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  return (
    <ProductModalContext.Provider value={{ product, setProduct, isProductModalOpen, setIsProductModalOpen }}>
      {children}
      <ProductModal optionsArray={optionsArray} stocks={stocks} />
    </ProductModalContext.Provider>
  );
};

export function useProductModal() {
  const context = useContext(ProductModalContext);

  if (context === undefined) {
    throw new Error("useProductModal must be used within a ProductModalProvider");
  }

  return context;
}

function ProductModal({ optionsArray, stocks }: { optionsArray: OptionsArray; stocks: Stock[] }) {
  const { serverAction: updateProductAction } = useServerAction(updateProduct);
  const { serverAction: createProductAction } = useServerAction(createProduct);
  const { product, isProductModalOpen, setIsProductModalOpen } = useProductModal();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...product },
  });

  useEffect(() => {
    if (!product) return;
    form.reset(product);
  }, [product, form.reset]);

  function onSubmit(data: ProductFormValues) {
    if (!product) {
      toast.error("Erreur");
      return;
    }
    setIsProductModalOpen(false);
    if (product.name) {
      updateProductAction({
        data,
        // onSuccess: () => scrollToId(`product-${product.index}`),
        onError: () => setIsProductModalOpen(true),
      });
    } else {
      createProductAction({
        data,
        // onSuccess: () => scrollToId(`product-${product.index}`),
        onError: () => setIsProductModalOpen(true),
      });
    }
  }

  return (
    <Modal title="Option" isOpen={isProductModalOpen} onClose={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <ProductForm optionsArray={optionsArray} stocks={stocks} />
        </form>
      </Form>
    </Modal>
  );
}

function ProductForm({
  optionsArray,
  stocks,
}: {
  optionsArray: OptionsArray;
  stocks: Stock[];
}) {
  const { product, setIsProductModalOpen } = useProductModal();
  const form = useFormContext<ProductFormValues>();
  const index = form.watch("index");
  const options = form.watch("options");
  const router = useRouter();
  const newProduct = !product?.name;
  const { serverAction } = useServerAction(deleteProduct);

  const onDelete = () => {
    setIsProductModalOpen(false);
    if (newProduct) {
      return;
    }

    serverAction({
      data: { id: product.id },
      onSuccess: () => {
        router.refresh();
      },
    });
  };
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <FormField
          control={form.control}
          name={`name`}
          render={({ field }) => (
            <FormItem className="relative w-48">
              <FormLabel>{`Nom du produit ${index + 1}`}</FormLabel>
              <FormControl>
                <Input disabled={form.formState.isSubmitting} placeholder="Nom du produit" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`price`}
          render={({ field }) => (
            <FormItem className="w-20 relative">
              <FormLabel>Prix TTC</FormLabel>
              <span className="absolute right-1 top-[44px] transform -translate-y-1/2 text-muted-foreground">€</span>
              <FormControl>
                <NumberInput disabled={form.formState.isSubmitting} placeholder="9,99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`tax`}
          render={({ field }) => (
            <FormItem className="w-20 relative">
              <FormLabel>TVA</FormLabel>
              <FormControl>
                <Select
                  disabled={form.formState.isSubmitting}
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner l'unité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[1300]">
                    {["1", "1.055", "1.2"].map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {getPercentage(Number(unit))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`description`}
          render={({ field }) => (
            <FormItem className="w-full max-w-96">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <AutosizeTextarea
                  disabled={form.formState.isSubmitting}
                  placeholder="Description du produit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`stocks`}
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>Stocks</FormLabel>
              <FormControl>
                <StockMultipleSelector
                  stocks={stocks.map((stock) => ({ value: stock.id, label: stock.name }))}
                  selectedStocks={field.value}
                  setSelectedStocks={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ProductIcon />
        <FormField
          control={form.control}
          name={`isArchived`}
          render={({ field }) => (
            <CheckboxForm
              ref={field.ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={form.formState.isSubmitting}
              title="Archivé"
              description="Ce produit n'apparaitra pas sur le site."
            />
          )}
        />
        <FormField
          control={form.control}
          name={`isFeatured`}
          render={({ field }) => (
            <CheckboxForm
              ref={field.ref}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={form.formState.isSubmitting}
              title="Mise en avant"
              description="Ce produit apparaitra sur la page d'accueil."
            />
          )}
        />
        <FormField
          control={form.control}
          name={`imagesUrl`}
          render={({ field }) => (
            <FormItem className="my-auto">
              <FormControl>
                <InputImageModal
                  ref={field.ref}
                  multipleImages
                  selectedFiles={field.value}
                  setSelectedFiles={(files: string[]) => {
                    field.onChange(files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-wrap gap-4 ">
        {options.map((_, optionIndex) => (
          <OptionValueForm key={optionIndex} optionIndex={optionIndex} optionsArray={optionsArray} />
        ))}
        {hasOptionWithValue(options, "Vrac") && (
          <FormField
            control={form.control}
            name={`unit`}
            render={({ field }) => (
              <FormItem className="w-48">
                <FormLabel>Unité</FormLabel>
                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner l'unité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-[1300]">
                    {Object.values(Unit).map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {getUnitLabel(unit).price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      {index > 0 ? (
        <TrashButton
          disabled={form.formState.isSubmitting}
          variant="destructive"
          size="sm"
          type="button"
          onClick={onDelete}
          className="my-auto"
          iconClassName="size-6"
        />
      ) : null}
    </>
  );
}

type StockMultipleSelectorProps = {
  selectedStocks: string[];
  setSelectedStocks: (tags: string[]) => void;
  disabled?: boolean;
  stocks: Option[];
};
const StockMultipleSelector = ({ selectedStocks, setSelectedStocks, disabled, stocks }: StockMultipleSelectorProps) => {
  const selectedStockOptions = selectedStocks
    .map((id) => stocks.find((stock) => stock.value === id))
    .filter((option) => option !== undefined) as Option[];

  function setSelectedStockOptions(select: Option[]) {
    setSelectedStocks(select.map((option) => option.value));
  }
  return (
    <div className="w-full">
      <MultipleSelector
        disabled={disabled}
        value={selectedStockOptions}
        onChange={setSelectedStockOptions}
        options={stocks}
        className="bg-background"
        emptyIndicator={
          <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">Aucun résultat</p>
        }
      />
    </div>
  );
};
