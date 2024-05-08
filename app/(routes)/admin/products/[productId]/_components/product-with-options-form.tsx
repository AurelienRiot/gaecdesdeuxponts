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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Check, ChevronsUpDown, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { OptionsArray } from "../page";
import OptionValueForm from "./options-values-form";
import { ProductFormValues } from "./product-form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Modal } from "@/components/ui/modal";
import UploadImage from "@/components/images-upload/image-upload";

export const ProductWithOptions = ({
  optionsArray,
}: {
  optionsArray: OptionsArray;
}) => {
  const form = useFormContext<ProductFormValues>();
  const products = form.watch("products");
  const options = products[0].options;

  const addProduct = () => {
    const newProduct = {
      name: "",
      description: "ajoutez une description",
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
        <FormItem className="">
          <FormLabel>Produits</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex items-end  gap-2">
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

                <div className="flex gap-2">
                  {options.map((_, optionIndex) => (
                    <OptionsName
                      options={options}
                      optionIndex={optionIndex}
                      optionsArray={optionsArray}
                      products={products}
                      key={optionIndex}
                    />
                  ))}
                </div>
              </div>
              {products.map((_, productIndex) => (
                <ProductName
                  key={productIndex}
                  products={products}
                  productIndex={productIndex}
                  options={options}
                  optionsArray={optionsArray}
                />
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

export function ProductName({
  productIndex,
  options,
  optionsArray,
  products,
}: {
  productIndex: number;
  options: { name: string; value: string }[];
  optionsArray: OptionsArray;
  products: ProductFormValues["products"];
}) {
  const form = useFormContext<ProductFormValues>();
  const [openImage, setOpenImage] = useState(false);

  const deleteProduct = () => {
    form.setValue(
      "products",
      products.filter(
        (_, index) => index !== productIndex,
      ) as ProductFormValues["products"],
    );
  };

  return (
    <>
      <div className="  space-y-4 overflow-x-auto px-4 pb-4">
        <div className="flex w-[1800px] gap-4">
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
                {productIndex > 0 && (
                  <IconButton
                    type="button"
                    onClick={deleteProduct}
                    className="absolute -left-2 top-4 bg-destructive p-1 text-destructive-foreground"
                    iconClassName="size-3"
                    Icon={X}
                  />
                )}
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
                    value={field.value || ""}
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
              <FormItem className="flex cursor-pointer flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archivé</FormLabel>
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
              <FormItem className="flex cursor-pointer flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mise en avant</FormLabel>
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
        </div>
        <div className="space-y-4 pl-4">
          {options.map((_, optionIndex) => (
            <OptionValueForm
              key={optionIndex}
              options={options}
              productIndex={productIndex}
              optionIndex={optionIndex}
              optionsArray={optionsArray}
            />
          ))}
        </div>
      </div>
    </>
  );
}
const OptionsName = ({
  optionsArray,
  products,
  optionIndex,
  options,
}: {
  optionsArray: OptionsArray;
  products: ProductFormValues["products"];
  optionIndex: number;
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
  return (
    <FormField
      control={form.control}
      name={`products.0.options.${optionIndex}.name`}
      render={({ field }) => (
        <FormItem className="relative w-48">
          <FormLabel>{`Nom de l'option ${optionIndex + 1}`}</FormLabel>
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
      className=" hide-scrollbar left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[90%] overflow-y-scroll"
    >
      <UploadImage
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        multipleImages
      />
    </Modal>
  );
};
