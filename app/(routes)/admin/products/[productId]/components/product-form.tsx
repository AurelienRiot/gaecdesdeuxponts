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
import { TextArea } from "@/components/ui/text-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Product } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { deleteProduct } from "../../components/server-action";
import { PlateEditor } from "./plate-editor";
import {
  ProductReturnType,
  createProduct,
  updateProduct,
} from "./server-action";
import { getFileKey } from "../../../categories/[categoryId]/components/category-form";

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
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof formSchema>;

type ProductFormProps = {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    initialData?.images.map((image) => getFileKey(image.url)) || [],
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
          ...initialData,
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          description: "",
          productSpecs: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
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
                    <TextArea
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
          </div>

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
