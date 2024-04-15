"use client";
import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import UploadImage from "@/components/images-upload/image-upload";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button, LoadingButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shop } from "@prisma/client";
import { ChevronDown, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import { z } from "zod";
import { getFileKey } from "../../../categories/[categoryId]/_components/category-form";
import {
  ReturnType,
  createShop,
  deleteShop,
  updateShop,
} from "./server-actions";

const formSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  imageUrl: z.string().optional(),
  lat: z.number(),
  long: z.number(),
  address: z.string().min(1, { message: "L'adresse est requise" }),
  phone: z.string().refine(
    (value) => {
      return value === "" || isValidPhoneNumber(value);
    },
    {
      message: "Le numéro de téléphone n'est pas valide",
    },
  ),
  email: z.string().email({ message: "L'email est invalide" }),
  website: z.string().optional(),
  description: z.string(),
  isArchived: z.boolean().default(false).optional(),
});

export type ShopFormValues = z.infer<typeof formSchema>;

const ShopForm = ({ initialData }: { initialData: Shop | null }) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>(
    initialData?.imageUrl ? [getFileKey(initialData?.imageUrl)] : [],
  );
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          imageUrl: "",
          description: initialData.description,
          lat: initialData.lat,
          long: initialData.long,
          address: initialData.address,
          phone: initialData.phone,
          website: initialData.website || "",
          email: initialData.email,
          isArchived: initialData.isArchived,
        }
      : {
          name: "",
          imageUrl: "",
          description: "",
          lat: 0,
          long: 0,
          address: "",
          phone: "",
          website: "",
          email: "",
          isArchived: false,
        },
  });

  const title = initialData
    ? "Modifier le magasin"
    : "Créer un nouveau magasin";
  const description = initialData
    ? "Modifier le magasin"
    : "Ajouter un nouveau magasin";
  const toastMessage = initialData ? "Magasin mis à jour" : "Magasin créé";
  const action = initialData
    ? "Sauvegarder les changements"
    : "Créer le magasin";

  const onSubmit = async (data: ShopFormValues) => {
    data.imageUrl = selectedFiles[0]
      ? `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${selectedFiles[0]}`
      : "";
    if (initialData) {
    }
    let result: ReturnType;
    if (initialData) {
      result = await updateShop({ data, id: initialData.id });
    } else {
      result = await createShop(data);
    }
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.push(`/admin/shops`);
    router.refresh();
    toast.success(toastMessage);
  };

  const onDelete = async () => {
    const deletesh = await deleteShop({ id: initialData?.id });
    if (!deletesh.success) {
      toast.error(deletesh.message);
      setOpen(false);
    } else {
      router.push(`/admin/shops`);
      router.refresh();
      toast.success("Magasin supprimé");
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
          className="w-full space-y-8 p-4"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <UploadImage
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
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
                    <Input
                      type="text"
                      disabled={form.formState.isSubmitting}
                      placeholder="Nom du magasin"
                      {...field}
                    />
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
            <FormField
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
            />

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
                        {"Ce magasin n'apparaitra pas sur le site."}
                      </FormDescription>
                    </div>
                  </label>
                </FormItem>
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
                    <Input
                      type="number"
                      disabled={form.formState.isSubmitting}
                      placeholder="Lattitude"
                      {...field}
                    />
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
                    <Input
                      type="number"
                      disabled={form.formState.isSubmitting}
                      placeholder="longitude"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

export default ShopForm;

const AddressForm = ({ form }: { form: UseFormReturn<ShopFormValues> }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value);
    setSuggestions(temp);
  };

  return (
    <FormField
      control={form.control}
      name={"address"}
      render={({ field }) => (
        <FormItem className="mt-[2px] flex w-[300px] flex-col gap-2">
          <FormLabel>Adresse</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <FormControl>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  onClick={() => setOpen((open) => !open)}
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    "  justify-between active:scale-100 ",
                    field.value && "font-normal text-muted-foreground ",
                  )}
                >
                  {"Rechercher l'adresse"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </FormControl>
            <PopoverContent className="w-fit p-0" side="bottom" align="start">
              <Command loop shouldFilter={false}>
                <CommandInput
                  placeholder="Entrer l'adresse..."
                  className="h-9 "
                  value={query}
                  onValueChange={(e) => {
                    setSearchTerm(e);
                    if (query.length < 3) {
                      form.setValue("address", "");
                    }
                    setOpen(true);
                  }}
                />
                <CommandList>
                  {query.length > 2 && (
                    <CommandEmpty>Adresse introuvable</CommandEmpty>
                  )}
                  {suggestions.map((address, index) => (
                    <CommandItem
                      className="cursor-pointer
                      bg-popover  text-popover-foreground"
                      value={index.toString()}
                      key={address.label}
                      onSelect={() => {
                        form.setValue("address", address.label);
                        form.setValue("long", address.coordinates[0]);
                        form.setValue("lat", address.coordinates[1]);
                        setOpen(false);
                      }}
                    >
                      {address.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            disabled={form.formState.isSubmitting}
            placeholder="Adresse du magasin"
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
