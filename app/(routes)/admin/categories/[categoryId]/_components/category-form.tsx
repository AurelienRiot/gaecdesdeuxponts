"use client";

import DeleteButton from "@/components/delete-button";
import UploadImage from "@/components/images-upload/image-upload";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
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
  const { serverAction: createCategoryAction } = useServerAction(createCategory);
  const { serverAction: updateCategoryAction } = useServerAction(updateCategory);

  const title = initialData ? "Modifier la categorie" : "Créer une nouvelle categorie";
  const description = initialData ? "Modifier la categorie" : "Ajouter une nouvelle categorie";
  const action = initialData ? "Sauvegarder les changements" : "Créer la categorie";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id || createId("category"),
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

    initialData ? await updateCategoryAction({ data, onSuccess }) : await createCategoryAction({ data, onSuccess });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <DeleteButton
            action={deleteCategorie}
            data={{ name: initialData.name }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.push(`/admin/categories`);
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Image du panneau d'affichage"} </FormLabel>
                <FormControl>
                  <UploadImage
                    ref={field.ref}
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
