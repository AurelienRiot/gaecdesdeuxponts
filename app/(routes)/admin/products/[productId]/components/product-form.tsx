"use client";

import UploadImage from "@/components/images-upload/image-upload";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, LoadingButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mergeWithoutDuplicates } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Product } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getFileKey } from "../../../categories/[categoryId]/components/category-form";
import { deleteProduct } from "../../components/server-action";
import LinkProducts from "./link-products";
import { PlateEditor } from "./plate-editor";
import {
  ProductReturnType,
  createProduct,
  updateProduct,
} from "./server-action";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  images: z
    .object({
      url: z.string(),
    })
    .array(),
  price: z.coerce
    .number()
    .min(1, { message: "Le prix doit être supérieur à 0" }),
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  productSpecs: z
    .string()
    .min(1, { message: "Les spécifications sont requises" }),
  description: z.string().min(1, { message: "La description est requise" }),
  linkProducts: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array()
    .optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isPro: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

type ProductFormProps = {
  initialData:
    | (Product & {
        images: Image[];
        linkedProducts: { id: string; name: string }[];
        linkedBy: { id: string; name: string }[];
      })
    | null;
  categories: Category[];
  products: { id: string; name: string; categoryId: string; isPro: boolean }[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  products,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    initialData?.images.map((image) => getFileKey(image.url)) || [],
  );
  const [options, setOptions] = useState<Option[]>(
    products
      .filter(
        (product) =>
          product.id !== initialData?.id &&
          product.categoryId === initialData?.categoryId &&
          product.isPro === initialData?.isPro,
      )
      .map((product) => ({
        value: product.id,
        label: product.name,
      })),
  );
  const title = initialData ? "Modifier le produit" : "Crée un nouveau produit";
  const description = initialData
    ? "Modifier le produit"
    : "Ajouter un nouveau produit";
  const toastMessage = initialData ? "Produit mise à jour" : "Produit crée";
  const action = initialData
    ? "Sauvegarder les changements"
    : "Crée le produit";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          images: [],
          price: initialData.price,
          categoryId: initialData.categoryId,
          description: initialData.description,
          productSpecs: initialData.productSpecs,
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
          isPro: initialData.isPro,
          linkProducts: mergeWithoutDuplicates(
            initialData.linkedProducts,
            initialData.linkedBy,
          ).map((product) => ({
            value: product.id,
            label: product.name,
          })),
        }
      : {
          name: "",
          images: [],
          linkProducts: [],
          price: 0,
          categoryId: "",
          description: "",
          productSpecs: "",
          isFeatured: false,
          isArchived: false,
          isPro: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (selectedFiles.length === 0) {
      toast.error("Veuillez ajouter au moins une image");
      return;
    }
    data.images = selectedFiles.map((file) => ({
      url: `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${file}`,
    }));

    let result: ProductReturnType;
    if (initialData) {
      result = await updateProduct(data, initialData.id);
    } else {
      result = await createProduct(data);
    }
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.push(`/admin/products`);
    router.refresh();
    toast.success(toastMessage);
  };

  const onChangeCategory = (value: string) => {
    form.setValue("categoryId", value);
    form.setValue("linkProducts", []);
    setOptions(
      products
        .filter(
          (product) =>
            product.id !== initialData?.id &&
            product.categoryId === value &&
            product.isPro === form.getValues("isPro"),
        )
        .map((product) => ({
          value: product.id,
          label: product.name,
        })),
    );
  };
  const onChangeIsPro = (value: boolean) => {
    form.setValue("isPro", value);
    form.setValue("linkProducts", []);
    setOptions(
      products
        .filter(
          (product) =>
            product.id !== initialData?.id &&
            product.categoryId === form.getValues("categoryId") &&
            product.isPro === value,
        )
        .map((product) => ({
          value: product.id,
          label: product.name,
        })),
    );
  };

  const onDelete = async () => {
    const deletePro = await deleteProduct({ id: initialData?.id });
    if (!deletePro.success) {
      toast.error(deletePro.message);
      setOpen(false);
    } else {
      router.push(`/admin/products`);
      router.refresh();
      toast.success("Produit supprimé");
    }
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={form.formState.isSubmitting}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 "
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
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
              name="price"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={form.formState.isSubmitting}
                      placeholder="9,99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Categorie</FormLabel>
                  <Select
                    disabled={form.formState.isSubmitting}
                    onValueChange={onChangeCategory}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selectionner une categorie"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
              name="description"
              render={({ field }) => (
                <FormItem className="w-96">
                  <FormLabel>Drescription</FormLabel>
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
              name="isFeatured"
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
              name="isArchived"
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
              name="isPro"
              render={({ field }) => (
                <FormItem className="flex cursor-pointer flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={onChangeIsPro}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Professionel</FormLabel>
                      <FormDescription>
                        {
                          "Ce produit apparaitra sur la partie professionnel du site."
                        }
                      </FormDescription>
                    </div>
                  </label>
                </FormItem>
              )}
            />
          </div>

          <LinkProducts form={form} options={options} />

          <PlateEditor
            loading={form.formState.isSubmitting}
            initialValue={
              initialData?.productSpecs
                ? JSON.parse(initialData?.productSpecs)
                : [
                    {
                      type: "p",
                      children: [{ text: "Specifications" }],
                    },
                  ]
            }
          />

          <LoadingButton
            disabled={form.formState.isSubmitting}
            className="ml-auto"
            type="submit"
          >
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
