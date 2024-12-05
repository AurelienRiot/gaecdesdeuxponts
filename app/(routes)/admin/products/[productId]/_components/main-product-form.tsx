"use client";

import CheckboxForm from "@/components/chekbox-form";
import DeleteButton from "@/components/delete-button";
import UploadImage from "@/components/images-upload/image-upload";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import deleteMainProduct from "../../_actions/delete-product";
import { createMainProduct } from "../_actions/create-main-product";
import { updateMainProduct } from "../_actions/update-main-product";
import { type MainProductFormValues, mainProductSchema } from "./product-schema";
import ProductSpecs from "./main-product-specs";

type MainProductFormProps = {
  initialData: MainProductFormValues;
  categories: Category[];
  newProduct?: boolean;
};

export const MainProductForm: React.FC<MainProductFormProps> = ({ initialData, categories, newProduct }) => {
  const router = useRouter();
  const { serverAction: createProductAction } = useServerAction(createMainProduct);
  const { serverAction: updateProductAction } = useServerAction(updateMainProduct);

  const title = newProduct ? "Crée un nouveau produit" : "Modifier le produit";
  const description = newProduct ? "Ajouter un nouveau produit" : "Modifier le produit";
  const action = newProduct ? "Crée le produit" : "Sauvegarder les changements";

  const form = useForm<MainProductFormValues>({
    resolver: zodResolver(mainProductSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => form.setFocus("name"), 0);
    return () => clearTimeout(timeoutId);
  }, [form]);

  const onSubmit = async (data: MainProductFormValues) => {
    function onSuccess() {
      router.replace(`/admin/products/${initialData.id}`, { scroll: false });
    }
    newProduct
      ? await createProductAction({
          data,
          onSuccess,
        })
      : await updateProductAction({
          data,
          onSuccess,
        });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {!newProduct && (
          <DeleteButton
            action={deleteMainProduct}
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
          {/* <ProductWithOptions stocks={stocks} optionsArray={optionsArray} /> */}
          <ProductSpecs />

          <FormButton className="ml-auto">{action}</FormButton>
        </form>
      </Form>
    </>
  );
};
