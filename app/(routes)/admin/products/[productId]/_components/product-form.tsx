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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Product } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { getFileKey } from "../../../categories/[categoryId]/_components/category-form";
import { deleteProduct } from "../../_components/server-action";
import { PlateEditor } from "./plate-editor";
import { updateProduct } from "../_actions/update-product";
import { createProduct } from "../_actions/create-product";
import { PlusCircledIcon } from "@radix-ui/react-icons";

const OptionSchema = z.object({
  name: z.string(),
  value: z.string(),
  price: z.number(),
});

const productSchema = z.object({
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string().min(1, { message: "La description est requise" }),
  productSpecs: z
    .string()
    .min(1, { message: "Les spécifications sont requises" }),
  price: z.coerce.number().optional(),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  isPro: z.boolean().default(false),
  imagesUrl: z.array(z.string()).optional(),
  option: OptionSchema.optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

type ProductFormProps = {
  initialData: Product | null;
  categories: Category[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    initialData?.imagesUrl.map((image) => getFileKey(image)) || [],
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
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          price: initialData.price || undefined,
          imagesUrl: initialData.imagesUrl,
          categoryId: initialData.categoryId,
          description: initialData.description,
          productSpecs: initialData.productSpecs,
          isFeatured: initialData.isFeatured,
          isArchived: initialData.isArchived,
          isPro: initialData.isPro,
        }
      : {
          name: "",
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
    data.imagesUrl = selectedFiles.map(
      (file) =>
        `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${file}`,
    );

    console.log(data);

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
            name="imagesUrl"
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
                      value={field.value || ""}
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
                        onCheckedChange={field.onChange}
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
          {/* <ProductOptions /> */}
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

// const ProductOptions = () => {
//   const form = useFormContext<ProductFormValues>();
//   const option = form.watch("option");
//   console.log(option);

//   const handleAddOptionClick = () => {
//     const addOptionRecursively = (option: Option | undefined): Option => {
//       if (!option) {
//         return {
//           name: "",
//           optionValues: [{ name: "", price: undefined, imagesUrl: [] }],
//         };
//       } else {
//         return {
//           ...option,
//           optionValues: option.optionValues.map((optionValue) => ({
//             ...optionValue,
//             option: addOptionRecursively(optionValue.option),
//           })),
//         };
//       }
//     };

//     const updatedOption = addOptionRecursively(option);
//     form.setValue("option", updatedOption);
//   };

//   return (
//     <div className="w-full space-y-6">
//       <Button
//         type="button"
//         variant="outline"
//         size="sm"
//         className="h-8 whitespace-nowrap border-dashed"
//         onClick={handleAddOptionClick}
//       >
//         <PlusCircledIcon className="mr-2 size-4" />
//         {"Ajouter une option"}
//       </Button>
//       <OptionForm option={option} optionPath="option" />
//     </div>
//   );
// };

// const OptionForm = ({
//   option,
//   optionPath,
//   prevOption,
//   prevOptionPath,
// }: {
//   option?: Option;
//   prevOption?: Option;
//   optionPath: string;
//   prevOptionPath?: string;
// }) => {
//   const form = useFormContext<ProductFormValues>();
//   if (!option) {
//     return null;
//   }

//   const addOptionValue = () => {
//     // @ts-ignore
//     form.setValue(`${optionPath}.optionValues`, [
//       ...option.optionValues,
//       { name: "", price: undefined, imagesUrl: [] },
//     ]);
//   };

//   return (
//     <>
//       <div className=" space-y-4 pl-4">
//         <div className="flex gap-4">
//           <Input
//             disabled={form.formState.isSubmitting}
//             placeholder="Nom de l'option"
//             value={
//               prevOption
//                 ? prevOption?.optionValues[0].option?.name
//                 : option?.name || ""
//             }
//             onChange={(e) => {
//               const formPath = prevOptionPath
//                 ? `${prevOptionPath}.optionValues.0.option.name`
//                 : `${optionPath}.name`;
//               // @ts-ignore
//               form.setValue(formPath, e.target.value);
//             }}
//             className="w-48"
//           />
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             className="h-8 whitespace-nowrap border-dashed"
//             onClick={addOptionValue}
//           >
//             <PlusCircledIcon className="mr-2 size-4" />
//             {"Ajouter une valeur"}
//           </Button>
//         </div>
//         {option.optionValues.map((_, index) => (
//           <OptionValueForm
//             key={index}
//             index={index}
//             option={option}
//             optionPath={optionPath}
//           />
//         ))}
//       </div>
//     </>
//   );
// };

// const OptionValueForm = ({
//   index,
//   option,
//   optionPath,
// }: {
//   index: number;
//   option: Option;
//   optionPath: string;
// }) => {
//   const form = useFormContext<ProductFormValues>();

//   return (
//     <div className=" space-y-4 pl-2">
//       <div className="flex gap-4">
//         <Input
//           type="text"
//           disabled={form.formState.isSubmitting}
//           placeholder="Nom de la valeur"
//           value={option.optionValues[index].name || ""}
//           onChange={(e) => {
//             form.setValue(
//               // @ts-ignore
//               `${optionPath}.optionValues.${index}.name`,
//               e.target.value,
//             );
//           }}
//           className="w-48"
//         />

//         <Input
//           type="number"
//           disabled={form.formState.isSubmitting}
//           placeholder="Prix"
//           value={option.optionValues[index].price || ""}
//           onChange={(e) => {
//             const value = e.target.value ? Number(e.target.value) : undefined;
//             // @ts-ignore
//             form.setValue(`${optionPath}.optionValues.${index}.price`, value);
//           }}
//           className="w-48"
//         />
//       </div>
//       {option.optionValues[index].option ? (
//         <OptionForm
//           option={option.optionValues[index].option}
//           prevOption={option}
//           prevOptionPath={optionPath}
//           optionPath={`${optionPath}.optionValues.${index}.option`}
//         />
//       ) : null}
//     </div>
//   );
// };
