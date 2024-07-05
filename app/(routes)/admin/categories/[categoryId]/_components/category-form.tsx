"use client";

import { TrashButton } from "@/components/animations/lottie-animation/trash-button";
import UploadImage from "@/components/images-upload/image-upload";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useSeverAction from "@/hooks/use-server-action";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import deleteCategorie from "../../_actions/delete-categorie";
import createCategory from "../_actions/create-category";
import updateCategory from "../_actions/update-category";
import { schema, type CategoryFormValues } from "./category-schema";

interface CategoryFormProps {
  initialData: Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { serverAction: createCategoryAction } = useSeverAction(createCategory);
  const { serverAction: updateCategoryAction } = useSeverAction(updateCategory);

  const title = initialData ? "Modifier la categorie" : "Créer une nouvelle categorie";
  const description = initialData ? "Modifier la categorie" : "Ajouter une nouvelle categorie";
  const action = initialData ? "Sauvegarder les changements" : "Créer la categorie";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      imageUrl: initialData?.imageUrl || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    function onSuccess() {
      router.push(`/admin/categories`);
      router.refresh();
    }
    initialData
      ? await updateCategoryAction({ data: { ...data, id: initialData.id }, onSuccess })
      : await createCategoryAction({ data, onSuccess });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && <DeleteCategory name={initialData.name} isSubmitting={form.formState.isSubmitting} />}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
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

          <LoadingButton disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};

function DeleteCategory({ name, isSubmitting }: { name: string; isSubmitting: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { serverAction, loading } = useSeverAction(deleteCategorie);

  const onDelete = async () => {
    function onSuccess() {
      router.push(`/admin/categories`);
      router.refresh();
    }
    await serverAction({ data: { name }, onSuccess, onFinally: () => setOpen(false) });
  };
  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />

      <TrashButton
        disabled={isSubmitting || loading}
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        iconClassName="size-6"
      />
    </>
  );
}
