import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import CheckboxForm from "@/components/chekbox-form";
import InputImageModal from "@/components/images-upload/image-modal";
import type { OptionsArray } from "@/components/product";
import { getUnitLabel, hasOptionWithValue } from "@/components/product/product-function";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, IconButton } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, NumberInput } from "@/components/ui/input";
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createId } from "@/lib/id";
import { scrollToId } from "@/lib/scroll-to-traget";
import { cn, getPercentage } from "@/lib/utils";
import { type Stock, Unit } from "@prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Check, ChevronLeft, ChevronRight, ChevronsDown, ChevronsUp, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import OptionValueForm from "./options-values-form";
import type { ProductFormValues } from "./product-schema";

export const ProductWithOptions = ({
  optionsArray,
  stocks,
}: {
  optionsArray: OptionsArray;
  stocks: Stock[];
}) => {
  const [listChanges, setListChanges] = useState(0);

  const form = useFormContext<ProductFormValues>();
  const products = form.watch("products");
  const options = products[0].options;

  const addProduct = () => {
    if (!products.every((item) => item.id)) {
      toast.error("Completer tous les produits deja existant");
      return;
    }
    const newProduct = {
      id: createId("product"),
      index: products.length,
      name: "",
      description: "",
      isArchived: false,
      isFeatured: false,
      imagesUrl: [],
      tax: 1.055,
      stocks: [],
      options: products[0].options.map((option) => ({
        index: option.index,
        name: option.name,
        value: "",
      })),
      price: 0,
    };
    form.setValue("products", [...products, newProduct]);
    scrollToId(`product-${newProduct.index}`, 10);
  };

  const addOptions = () => {
    const newOption = { index: options.length, name: "", value: "" };
    products.map((product, productIndex) => {
      form.setValue(`products.${productIndex}.options`, [...product.options, newOption]);
    });
  };

  return (
    <FormField
      control={form.control}
      name="products"
      render={({ field }) => (
        <FormItem key={listChanges} className="">
          <FormLabel>Produits</FormLabel>
          <FormControl>
            <div className="space-y-6">
              <div className="flex flex-wrap items-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap border-dashed"
                  onClick={addProduct}
                >
                  <PlusCircledIcon className="mr-2 size-4" />
                  {"Ajouter un produit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="whitespace-nowrap border-dashed"
                  onClick={addOptions}
                >
                  <PlusCircledIcon className="mr-2 size-4" />
                  {"Ajouter une option"}
                </Button>

                {options.map((_, optionIndex) => (
                  <OptionsName
                    options={options}
                    optionIndex={optionIndex}
                    optionsArray={optionsArray}
                    products={products}
                    key={optionIndex}
                    setListChanges={setListChanges}
                  />
                ))}
              </div>
              {products.map((_, productIndex) => (
                <div key={productIndex} className=" rounded-md p-4 space-y-4 bg-chart1/50 even:bg-chart2/50 w-full">
                  <ProductName
                    setListChanges={setListChanges}
                    products={products}
                    productIndex={productIndex}
                    options={options}
                    optionsArray={optionsArray}
                    stocks={stocks}
                  />
                </div>
              ))}
            </div>
          </FormControl>
          {form.formState.errors.products && (
            <p className={"text-sm font-medium text-destructive"}>
              {form.formState.errors.products?.message || "Veuillez completer tous les champs"}
            </p>
          )}
        </FormItem>
      )}
    />
  );
};

function ProductName({
  productIndex,
  options,
  optionsArray,
  products,
  setListChanges,
  stocks,
}: {
  productIndex: number;
  options: { name: string; value: string }[];
  optionsArray: OptionsArray;
  products: ProductFormValues["products"];
  stocks: Stock[];
  setListChanges: React.Dispatch<React.SetStateAction<number>>;
}) {
  const form = useFormContext<ProductFormValues>();

  const moveProductUp = () => {
    if (productIndex > 0) {
      const newProducts: ProductFormValues["products"] = [...products];
      const temp = { ...newProducts[productIndex - 1], index: productIndex };
      newProducts[productIndex - 1] = {
        ...newProducts[productIndex],
        index: productIndex - 1,
      };
      newProducts[productIndex] = temp;
      form.setValue("products", newProducts);
      setListChanges((prev) => prev + 1);
    }
  };

  const moveProductDown = () => {
    if (productIndex < products.length - 1) {
      const newProducts: ProductFormValues["products"] = [...products];
      const temp = { ...newProducts[productIndex + 1], index: productIndex };
      newProducts[productIndex + 1] = {
        ...newProducts[productIndex],
        index: productIndex + 1,
      };
      newProducts[productIndex] = temp;
      form.setValue("products", newProducts);
      setListChanges((prev) => prev + 1);
    }
  };

  const deleteProduct = () => {
    const newProducts = products.filter((_, index) => index !== productIndex);
    form.setValue("products", newProducts as ProductFormValues["products"]);
    setListChanges((prev) => prev + 1);
  };
  return (
    <>
      <div id={`product-${productIndex}`} className="flex flex-wrap gap-4">
        <div className="flex h-full flex-col justify-between gap-4 py-2">
          <IconButton
            Icon={ChevronsUp}
            className={productIndex === 0 ? "hidden" : "block"}
            iconClassName={"size-4"}
            onClick={moveProductUp}
            type="button"
          />
          <IconButton
            Icon={ChevronsDown}
            className={productIndex === products.length - 1 ? "hidden" : "block"}
            iconClassName="size-4"
            onClick={moveProductDown}
            type="button"
          />
        </div>

        <FormField
          control={form.control}
          name={`products.${productIndex}.name`}
          render={({ field }) => (
            <FormItem className="relative w-48">
              <FormLabel>{`Nom du produit ${productIndex + 1}`}</FormLabel>
              <FormControl>
                <Input disabled={form.formState.isSubmitting} placeholder="Nom du produit" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`products.${productIndex}.price`}
          render={({ field }) => (
            <FormItem className="w-20 relative">
              <FormLabel>Prix</FormLabel>
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
          name={`products.${productIndex}.tax`}
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
                  <SelectContent>
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
          name={`products.${productIndex}.description`}
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
          name={`products.${productIndex}.stocks`}
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
        <FormField
          control={form.control}
          name={`products.${productIndex}.isArchived`}
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
          name={`products.${productIndex}.isFeatured`}
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
          name={`products.${productIndex}.imagesUrl`}
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
        {productIndex > 0 || products.length > 1 ? (
          <TrashButton
            disabled={form.formState.isSubmitting}
            variant="destructive"
            size="sm"
            onClick={deleteProduct}
            className="my-auto"
            iconClassName="size-6"
          />
          // <IconButton
          //   type="button"
          //   onClick={deleteProduct}
          //   className="my-auto h-fit rounded-md bg-destructive p-1 text-destructive-foreground"
          //   iconClassName="size-6 "
          //   Icon={Trash}
          // />
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 ">
        {options.map((_, optionIndex) => (
          <OptionValueForm
            key={optionIndex}
            options={options}
            productIndex={productIndex}
            optionIndex={optionIndex}
            optionsArray={optionsArray}
          />
        ))}
        {hasOptionWithValue(products[productIndex].options, "Vrac") && (
          <FormField
            control={form.control}
            name={`products.${productIndex}.unit`}
            render={({ field }) => (
              <FormItem className="w-48">
                <FormLabel>Unité</FormLabel>
                <Select disabled={form.formState.isSubmitting} onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectionner l'unité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
    </>
  );
}
const OptionsName = ({
  optionsArray,
  products,
  optionIndex,
  options,
  setListChanges,
}: {
  optionsArray: OptionsArray;
  products: ProductFormValues["products"];
  optionIndex: number;
  setListChanges: React.Dispatch<React.SetStateAction<number>>;
  options: ProductFormValues["products"][0]["options"];
}) => {
  const form = useFormContext<ProductFormValues>();
  const [openName, setOpenName] = useState(false);
  const [search, setSearch] = useState("");

  const deleteOption = () => {
    products.map((_, productIndex) => {
      form.setValue(
        `products.${productIndex}.options`,
        options.filter((_, index) => index !== optionIndex),
      );
    });
  };

  const changeOptionName = (newName: string) => {
    products.map((_, productIndex) => {
      form.setValue(`products.${productIndex}.options.${optionIndex}.name`, newName);
    });
  };

  const moveOptionLeft = () => {
    if (optionIndex > 0) {
      const newOptions = [...options];
      const temp = { ...newOptions[optionIndex - 1], index: optionIndex };
      newOptions[optionIndex - 1] = {
        ...newOptions[optionIndex],
        index: optionIndex - 1,
      };
      newOptions[optionIndex] = temp;
      products.map((_, productIndex) => {
        form.setValue(`products.${productIndex}.options`, newOptions);
      });
      setListChanges((prev) => prev + 1);
    }
  };

  const moveOptionRigth = () => {
    if (optionIndex < products.length - 1) {
      const newOptions = [...options];
      const temp = { ...newOptions[optionIndex + 1], index: optionIndex };
      newOptions[optionIndex + 1] = {
        ...newOptions[optionIndex],
        index: optionIndex + 1,
      };
      newOptions[optionIndex] = temp;
      products.map((_, productIndex) => {
        form.setValue(`products.${productIndex}.options`, newOptions);
      });
      setListChanges((prev) => prev + 1);
    }
  };

  return (
    <FormField
      control={form.control}
      name={`products.0.options.${optionIndex}.name`}
      render={({ field }) => (
        <FormItem className="relative w-48">
          <FormLabel className="flex gap-2">
            <span className="flex items-center">{`Nom de l'option ${optionIndex + 1}`}</span>
            <IconButton
              Icon={ChevronLeft}
              className={optionIndex === 0 ? "opacity-0" : ""}
              iconClassName={"size-4"}
              onClick={moveOptionLeft}
              type="button"
            />
            <IconButton
              Icon={ChevronRight}
              className={optionIndex === options.length - 1 ? "opacity-0" : ""}
              iconClassName="size-4"
              onClick={moveOptionRigth}
              type="button"
            />
          </FormLabel>
          <FormControl>
            <Popover open={openName} onOpenChange={setOpenName}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={form.formState.isSubmitting}
                  className={cn("min-w-48 justify-between", options[optionIndex].name ? "" : "text-muted-foreground")}
                >
                  {options[optionIndex].name ? options[optionIndex].name : "Nom de l'option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput value={search} onValueChange={setSearch} placeholder="Nom de l'option" />
                  <CommandList>
                    {optionsArray.map(({ name }) => (
                      <CommandItem
                        key={name}
                        value={name}
                        onSelect={(currentValue) => {
                          changeOptionName(currentValue);
                          setOpenName(false);
                          setSearch("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            options[optionIndex].name === name ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {name}
                      </CommandItem>
                    ))}
                    {!!search && (
                      <CommandItem
                        value={search}
                        className="cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          changeOptionName(search);
                          setOpenName(false);
                          setSearch("");
                        }}
                      >
                        {" "}
                        <Check className={"mr-2 h-4 w-4 opacity-0"} />
                        {`Créer "${search}"`}
                      </CommandItem>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
          <IconButton
            type="button"
            onClick={deleteOption}
            className="absolute -left-2 top-4 bg-destructive p-1 text-destructive-foreground"
            iconClassName="size-3"
            Icon={X}
          />
        </FormItem>
      )}
    />
  );
};

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

  console.log(selectedStocks);
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
