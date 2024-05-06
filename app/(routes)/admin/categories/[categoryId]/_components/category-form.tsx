"use client";

import UploadImage from "@/components/images-upload/image-upload";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { deleteCategorie } from "../../_components/server-action";
import { createCategory, updateCategory } from "./server-action";

interface CategoryFormProps {
  initialData: Category | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est obligatoire" }),
  imageUrl: z.string().min(1, { message: "L'image est obligatoire" }),
  description: z.string().min(1, { message: "La description est obligatoire" }),
});

export type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const title = initialData
    ? "Modifier la categorie"
    : "Créer une nouvelle categorie";
  const description = initialData
    ? "Modifier la categorie"
    : "Ajouter une nouvelle categorie";
  const toastMessage = initialData
    ? "Categorie mise à jour"
    : "Categorie créée";
  const action = initialData
    ? "Sauvegarder les changements"
    : "Créer la categorie";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      imageUrl: initialData?.imageUrl || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const result = initialData
      ? await updateCategory(data, initialData.id)
      : await createCategory(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.push(`/admin/categories`);
    router.refresh();

    toast.success(toastMessage);
  };

  const onDelete = async () => {
    const deleteCat = await deleteCategorie({ name: initialData?.name });
    if (!deleteCat.success) {
      toast.error(deleteCat.message);
      setOpen(false);
    } else {
      router.push(`/admin/categories`);
      router.refresh();
      toast.success("Categorie supprimée");
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
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Image du panneau d'affichage"} </FormLabel>
                <FormControl>
                  <UploadImage
                    selectedFiles={field.value ? [field.value] : []}
                    setSelectedFiles={(files: string[]) => {
                      if (files.length > 0) {
                        field.onChange(files[0]);
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Nom de la categorie"
                    className="w-fit"
                    {...field}
                  />
                </FormControl>
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
                    placeholder="Description de la categorie"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
