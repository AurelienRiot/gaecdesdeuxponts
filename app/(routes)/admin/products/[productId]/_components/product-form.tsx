"use client";

import UploadImage from "@/components/images-upload/image-upload";
import { AlertModal } from "@/components/ui/alert-modal-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MainProductWithProducts } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Unit } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { deleteProduct } from "../../_components/server-action";
import { OptionsArray } from "../page";
import { PlateEditor } from "./plate-editor";
import { ProductWithOptions } from "./product-with-options-form";
import { updateProduct } from "../_actions/update-product";
import { createProduct } from "../_actions/create-product";

const OptionSchema = z.object({
  name: z.string().min(1, { message: "Le nom de l'option est requis" }),
  value: z.string().min(1, { message: "La valeur de l'option est requis" }),
});

const productSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string(),
  price: z.coerce
    .number()
    .optional()
    .refine((val) => val !== undefined, {
      message: "Veuillez entrer un prix valide",
    }),
  unit: z.enum(["centgramme", "Kilogramme", "Litre"]).optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  imagesUrl: z.array(z.string()),
  options: z.array(OptionSchema),
});

const mainProductSchema = z.object({
  categoryName: z.string().min(1, { message: "La catégorie est requise" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  productSpecs: z
    .string()
    .min(1, { message: "Les spécifications sont requises" }),
  isArchived: z.boolean().default(false),
  isPro: z.boolean().default(false),
  imagesUrl: z.array(z.string()).refine((data) => data.length > 0, {
    message: "Au moins une image est requise",
  }),
  products: z
    .array(productSchema)
    .nonempty("Veuillez ajouter au moins un produit"),
});

export type ProductSchema = z.infer<typeof productSchema>;

export type ProductFormValues = z.infer<typeof mainProductSchema>;

type ProductFormProps = {
  initialData: MainProductWithProducts | null;
  categories: Category[];
  optionsArray: OptionsArray;
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  optionsArray,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const title = initialData ? "Modifier le produit" : "Crée un nouveau produit";
  const description = initialData
    ? "Modifier le produit"
    : "Ajouter un nouveau produit";
  const toastMessage = initialData ? "Produit mise à jour" : "Produit crée";
  const action = initialData
    ? "Sauvegarder les changements"
    : "Crée le produit";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(mainProductSchema),
    defaultValues: {
      name: initialData?.name || "",
      imagesUrl: initialData?.imagesUrl || [],
      categoryName: initialData?.categoryName || "",
      productSpecs: initialData?.productSpecs || "",
      isArchived: initialData?.isArchived || false,
      isPro: initialData?.isPro || false,
      products: initialData?.products.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit || undefined,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        imagesUrl: product.imagesUrl,
        options: product.options.map((option) => ({
          name: option.name,
          value: option.value,
        })),
      })) || [
        {
          name: "",
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

  const onSubmit = async (data: ProductFormValues) => {
    if (initialData) {
      const result = await updateProduct(data, initialData.id);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
    } else {
      const result = await createProduct(data);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
    }

    router.push("/admin/products");
    router.refresh();
    toast.success(toastMessage);
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
            name="imagesUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage
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
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selectionner une categorie"
                        />
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
                <FormItem className="flex  flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
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
              name="isPro"
              render={({ field }) => (
                <FormItem className="flex  flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <label className="flex cursor-pointer flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Professionel
                      </FormLabel>
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
          <ProductWithOptions optionsArray={optionsArray} />
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
