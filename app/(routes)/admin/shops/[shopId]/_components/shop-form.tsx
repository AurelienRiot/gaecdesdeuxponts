"use client";
import type { Suggestion } from "@/actions/adress-autocompleteFR";
import CheckboxForm from "@/components/chekbox-form";
import DeleteButton from "@/components/delete-button";
import TagsMultipleSelector from "@/components/display-shops/tags";
import UploadImage from "@/components/images-upload/image-upload";
import SearchAddress from "@/components/search-address";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input, NumberInput } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUsersQueryClient } from "@/hooks/use-query/users-query";
import useServerAction from "@/hooks/use-server-action";
import { createId } from "@/lib/id";
import type { FullShop, Nullable } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type UseFormReturn } from "react-hook-form";
import createShop from "../_actions/create-shop";
import deleteShop from "../_actions/delete-shop";
import updateShop from "../_actions/update-shop";
import ShopHoursModal from "./shop-hours";
import ShopLinks from "./shop-links";
import { schema, TYPE, type ShopFormValues } from "./shop-schema";

export const defaultHours = {
  isClosed: false,
  openHour1: new Date(new Date().setHours(8, 0, 0, 0)),
  closeHour1: new Date(new Date().setHours(19, 0, 0, 0)),
  openHour2: new Date(new Date().setHours(15, 30, 0, 0)),
  closeHour2: new Date(new Date().setHours(19, 0, 0, 0)),
};

const ShopForm = ({ initialData }: { initialData: Nullable<FullShop> | null }) => {
  const router = useRouter();
  const { mutateUsers } = useUsersQueryClient();
  const { serverAction: createShopAction } = useServerAction(createShop);
  const { serverAction: updateShopAction } = useServerAction(updateShop);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: initialData?.id || createId("shop"),
      name: initialData?.name || "",
      imageUrl: initialData?.imageUrl || "",
      userId: initialData?.userId || "",
      description: initialData?.description || "",
      type: initialData?.type || undefined,
      lat: initialData?.lat || undefined,
      long: initialData?.long || undefined,
      tags: initialData?.tags || [],
      address: initialData?.address || "",
      links: initialData?.links || [],
      shopHours: initialData?.shopHours || [],
      phone: initialData?.phone || "",
      website: initialData?.website || "",
      email: initialData?.email || undefined,
      isArchived: initialData?.isArchived || false,
    },
  });

  const title = initialData?.id ? "Modifier le magasin" : "Créer un nouveau magasin";
  const description = initialData?.id ? "Modifier le magasin" : "Ajouter un nouveau magasin";
  const action = initialData?.id ? "Sauvegarder les changements" : "Créer le magasin";

  const onSubmit = async (data: ShopFormValues) => {
    function onSuccess() {
      mutateUsers((users) =>
        users.map((user) =>
          user.id === data.userId ? { ...user, links: data.links, shopHours: data.shopHours } : user,
        ),
      );

      router.back();
    }
    initialData?.id ? await updateShopAction({ data, onSuccess }) : await createShopAction({ data, onSuccess });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData?.id && (
          <DeleteButton
            action={deleteShop}
            data={{ id: initialData.id }}
            isSubmitting={form.formState.isSubmitting}
            onSuccess={() => {
              router.back();
            }}
          />
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))} className="w-full space-y-8 p-4">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
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
          <div className="flex max-w-[1000px] flex-wrap gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[250px]">
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={form.formState.isSubmitting} placeholder="Nom du magasin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={form.formState.isSubmitting}
                      placeholder="Email du magasin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={form.formState.isSubmitting}
                      placeholder="Site internet du magasin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <ShopLinks />
            <ShopHoursModal />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-[300px]">
                  <FormLabel>Numéros de téléphone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="Entrer un numéro de téléphone"
                      defaultCountry="FR"
                      className="w-full"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <CheckboxForm
                  checked={field.value}
                  ref={field.ref}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  title="Archivé"
                  description="Ce magasin n'apparaitra pas sur le site."
                />
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-[500px]">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <AutosizeTextarea
                      {...field}
                      placeholder="Description du magasin"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="w-[500px]">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsMultipleSelector
                      selectedTags={field.value}
                      setSelectedTags={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-44">
                  <FormLabel>Type</FormLabel>
                  <Select
                    disabled={form.formState.isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue defaultValue={field.value} placeholder="Selectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-[1300]">
                      {TYPE.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-wrap items-start gap-8">
            <AddressForm form={form} />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <FormLabel>Lattitude</FormLabel>
                  <FormControl>
                    <NumberInput disabled={form.formState.isSubmitting} placeholder="Lattitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="long"
              render={({ field }) => (
                <FormItem className="w-[150px]">
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <NumberInput disabled={form.formState.isSubmitting} placeholder="longitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoadingButton disabled={form.formState.isSubmitting} className="ml-auto" type="submit">
            {action}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};

export default ShopForm;

const AddressForm = ({ form }: { form: UseFormReturn<ShopFormValues> }) => {
  function onValueChange(address: Suggestion) {
    form.setValue("address", address.label);
    form.setValue("long", address.longitude);
    form.setValue("lat", address.latitude);
  }

  return (
    <FormField
      control={form.control}
      name={"address"}
      render={({ field }) => (
        <FormItem className="mt-[2px] flex w-[300px] flex-col gap-2">
          <FormLabel>Adresse</FormLabel>
          <SearchAddress onValueChange={onValueChange} />
          <Input type="text" disabled={form.formState.isSubmitting} placeholder="Adresse du magasin" {...field} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
