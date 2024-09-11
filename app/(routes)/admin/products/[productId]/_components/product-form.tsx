"use client";

import CheckboxForm from "@/components/chekbox-form";
import DeleteButton from "@/components/delete-button";
import UploadImage from "@/components/images-upload/image-upload";
import type { OptionsArray } from "@/components/product/product-function";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import type { MainProductWithProducts } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import deleteProduct from "../../_actions/delete-product";
import { createProduct } from "../_actions/create-product";
import { updateProduct } from "../_actions/update-product";
import { mainProductSchema, type ProductFormValues } from "./product-schema";
import ProductSpecs from "./product-specs";
import { ProductWithOptions } from "./product-with-options-form";

type ProductFormProps = {
  initialData: MainProductWithProducts | null;
  categories: Category[];
  optionsArray: OptionsArray;
};

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, optionsArray }) => {
  const router = useRouter();
  const { serverAction: createProductAction } = useServerAction(createProduct);
  const { serverAction: updateProductAction } = useServerAction(updateProduct);

  const title = initialData ? "Modifier le produit" : "Crée un nouveau produit";
  const description = initialData ? "Modifier le produit" : "Ajouter un nouveau produit";
  const action = initialData ? "Sauvegarder les changements" : "Crée le produit";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(mainProductSchema),
    defaultValues: {
      id: initialData?.id || createId("mainProduct"),
      name: initialData?.name || "",
      imagesUrl: initialData?.imagesUrl || [],
      categoryName: initialData?.categoryName || "",
      productSpecs: initialData?.productSpecs || "",
      isArchived: initialData?.isArchived || false,
      isPro: initialData?.isPro || false,
      products: initialData?.products.map((product) => ({
        id: product.id,
        index: product.index,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit || undefined,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        imagesUrl: product.imagesUrl,
        options: product.options.map((option) => ({
          index: option.index,
          name: option.name,
          value: option.value,
        })),
      })) || [
        {
          name: "",
          index: 0,
          id: createId("product"),
          description: "",
          price: undefined,
          isFeatured: false,
          isArchived: false,
          imagesUrl: [],
          options: [],
        },
      ],
    },
  });

  useEffect(() => {
    setTimeout(() => form.setFocus("name"), 0);
  }, [form]);

  const onSubmit = async (data: ProductFormValues) => {
    function onSuccess() {
      router.push("/admin/products");
      router.refresh();
    }
    initialData ? await updateProductAction({ data, onSuccess }) : await createProductAction({ data, onSuccess });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <DeleteButton
            action={deleteProduct}
            data={{ id: initialData.id }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.push(`/admin/products`);
              router.refresh();
            }}
          />
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <FormField
            control={form.control}
            name="imagesUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage
                    ref={field.ref}
                    selectedFiles={field.value}
                    setSelectedFiles={(files: string[]) => {
                      field.onChange(files);
                    }}
                    multipleImages
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} placeholder="Nom du produit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Categorie</FormLabel>
                  <Select
                    disabled={form.formState.isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selectionner une categorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
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
              name="isPro"
              render={({ field }) => (
                <CheckboxForm
                  ref={field.ref}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  title="Professionel"
                  description="Ce produit apparaitra sur la partie professionnel du site."
                />
              )}
            />
          </div>
          <ProductWithOptions optionsArray={optionsArray} />
          <ProductSpecs />

          <FormButton className="ml-auto">{action}</FormButton>
        </form>
      </Form>
    </>
  );
};
