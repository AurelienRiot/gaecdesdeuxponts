import UploadImage from "@/components/images-upload/image-upload";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, IconButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsUp,
  ChevronsUpDown,
  Trash,
  UploadCloud,
  X,
} from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { OptionsArray } from "../page";
import OptionValueForm from "./options-values-form";
import { ProductFormValues } from "./product-form";
import {
  getUnitLabel,
  hasOptionWithValue,
} from "@/components/product/product-function";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Unit } from "@prisma/client";
import { nanoid } from "nanoid";

export const ProductWithOptions = ({
  optionsArray,
}: {
  optionsArray: OptionsArray;
}) => {
  const [listChanges, setListChanges] = useState(0);

  const form = useFormContext<ProductFormValues>();
  const products = form.watch("products");
  const options = products[0].options;

  const addProduct = () => {
    const newProduct = {
      id: `PR_${nanoid()}`,
      name: "",
      description: "",
      isArchived: false,
      isFeatured: false,
      imagesUrl: [],
      options: products[0].options.map((option) => ({
        name: option.name,
        value: "",
      })),
      price: undefined,
    };
    form.setValue("products", [...products, newProduct]);
  };

  const addOptions = () => {
    const newOption = { name: "", value: "" };
    products.map((product, productIndex) => {
      form.setValue(`products.${productIndex}.options`, [
        ...product.options,
        newOption,
      ]);
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
            <div className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className=" whitespace-nowrap border-dashed"
                  onClick={addProduct}
                >
                  <PlusCircledIcon className="mr-2 size-4" />
                  {"Ajouter un produit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className=" whitespace-nowrap border-dashed"
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
                <div
                  key={productIndex}
                  className="overflow-x-auto rounded-md p-4 pb-4    thin-scrollbar even:bg-secondary"
                >
                  <ProductName
                    setListChanges={setListChanges}
                    products={products}
                    productIndex={productIndex}
                    options={options}
                    optionsArray={optionsArray}
                  />
                </div>
              ))}
            </div>
          </FormControl>
          {form.formState.errors.products && (
            <p className={"text-sm font-medium text-destructive"}>
              {form.formState.errors.products?.message ||
                "Veuillez completer tous les champs"}
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
}: {
  productIndex: number;
  options: { name: string; value: string }[];
  optionsArray: OptionsArray;
  products: ProductFormValues["products"];
  setListChanges: React.Dispatch<React.SetStateAction<number>>;
}) {
  const form = useFormContext<ProductFormValues>();
  const [openImage, setOpenImage] = useState(false);

  const moveProductUp = () => {
    if (productIndex > 0) {
      const newProducts: ProductFormValues["products"] = [...products];
      const temp = newProducts[productIndex - 1];
      newProducts[productIndex - 1] = newProducts[productIndex];
      newProducts[productIndex] = temp;
      form.setValue("products", newProducts);
      setListChanges((prev) => prev + 1);
    }
  };

  const moveProductDown = () => {
    if (productIndex < products.length - 1) {
      const newProducts: ProductFormValues["products"] = [...products];
      const temp = newProducts[productIndex + 1];
      newProducts[productIndex + 1] = newProducts[productIndex];
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
      <div className="flex min-w-[1800px] gap-4">
        <div className="flex h-full flex-col justify-between gap-4 py-2">
          <IconButton
            Icon={ChevronsUp}
            className={productIndex === 0 ? " opacity-0 " : ""}
            iconClassName={"size-4"}
            onClick={moveProductUp}
            type="button"
          />
          <IconButton
            Icon={ChevronsDown}
            className={productIndex === products.length - 1 ? "opacity-0" : ""}
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
              <FormLabel>{`Name du produit ${productIndex + 1}`}</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  placeholder="Nom du produit"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`products.${productIndex}.price`}
          render={({ field }) => (
            <FormItem className="w-48">
              <FormLabel>Prix</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  disabled={form.formState.isSubmitting}
                  placeholder="9,99"
                  {...field}
                  value={products[productIndex].price || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`products.${productIndex}.description`}
          render={({ field }) => (
            <FormItem className="w-96">
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
          name={`products.${productIndex}.isArchived`}
          render={({ field }) => (
            <FormItem className="flex  flex-row items-start space-x-3 space-y-0 rounded-md border ">
              <label className="flex h-full w-full cursor-pointer flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">Archivé</FormLabel>
                  <FormDescription>
                    {"Ce produit n'apparaitra pas sur le site."}
                  </FormDescription>
                </div>
              </label>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`products.${productIndex}.isFeatured`}
          render={({ field }) => (
            <FormItem className="flex  flex-row items-start space-x-3 space-y-0 rounded-md border ">
              <label className="flex h-full w-full cursor-pointer flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Mise en avant
                  </FormLabel>
                  <FormDescription>
                    {"Ce produit apparaitra sur la page d'accueil."}
                  </FormDescription>
                </div>
              </label>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`products.${productIndex}.imagesUrl`}
          render={({ field }) => (
            <FormItem className="">
              <FormControl>
                <>
                  <ImageModal
                    isOpen={openImage}
                    onClose={() => setOpenImage(false)}
                    selectedFiles={field.value}
                    setSelectedFiles={(files: string[]) => {
                      field.onChange(files);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setOpenImage(true)}
                    className="relative flex aspect-square  cursor-pointer flex-col items-center justify-center  rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-10 py-6 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 
                    "
                  >
                    <div className=" text-center ">
                      <div className=" mx-auto max-w-min rounded-md border bg-foreground p-2">
                        <UploadCloud
                          size={20}
                          className="text-primary-foreground"
                        />
                      </div>

                      <FormLabel className="mt-2 text-sm font-semibold text-primary">
                        Images
                      </FormLabel>
                    </div>
                  </button>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {productIndex > 0 || products.length > 1 ? (
          <IconButton
            type="button"
            onClick={deleteProduct}
            className="my-auto h-fit rounded-md bg-destructive p-1 text-destructive-foreground"
            iconClassName="size-6 "
            Icon={Trash}
          />
        ) : null}
      </div>
      <div className="flex gap-4 pl-4">
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
                <Select
                  disabled={form.formState.isSubmitting}
                  onValueChange={field.onChange}
                  value={field.value}
                >
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
  options: { name: string; value: string }[];
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
      form.setValue(
        `products.${productIndex}.options.${optionIndex}.name`,
        newName,
      );
    });
  };

  const moveOptionLeft = () => {
    if (optionIndex > 0) {
      const newOptions = [...options];
      const temp = newOptions[optionIndex - 1];
      newOptions[optionIndex - 1] = newOptions[optionIndex];
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
      const temp = newOptions[optionIndex + 1];
      newOptions[optionIndex + 1] = newOptions[optionIndex];
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
          <FormLabel className="flex gap-2 ">
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
                  className={cn(
                    "min-w-48 justify-between",
                    options[optionIndex].name ? "" : "text-muted-foreground",
                  )}
                >
                  {options[optionIndex].name
                    ? options[optionIndex].name
                    : "Nom de l'option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Nom de l'option"
                  />
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
                            options[optionIndex].name === name
                              ? "opacity-100"
                              : "opacity-0",
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

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
}

const ImageModal = ({
  isOpen,
  onClose,
  selectedFiles,
  setSelectedFiles,
}: ImageModalProps) => {
  return (
    <Modal
      title="Ajouter des images"
      description=""
      isOpen={isOpen}
      onClose={onClose}
      className=" left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[90%] overflow-y-scroll hide-scrollbar"
    >
      <UploadImage
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages
      />
    </Modal>
  );
};
