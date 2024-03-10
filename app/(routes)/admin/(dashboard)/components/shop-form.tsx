"use client";
import AddressAutocomplete, {
  Suggestion,
} from "@/actions/adress-autocompleteFR";
import { FullAdress } from "@/components/address-form";
import UploadImage from "@/components/images-upload/image-upload";
import { Button, LoadingButton } from "@/components/ui/button";
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
import { addDelay, cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { createShop } from "./server-actions";
import { toast } from "sonner";

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
});

export type ShopFormValues = z.infer<typeof formSchema>;

const ShopForm = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
      description: "",
      lat: 0,
      long: 0,
      address: "",
      phone: "",
      website: "",
      email: "",
    },
  });

  const onSubmit = async (data: ShopFormValues) => {
    await addDelay(1000);
    data.imageUrl = selectedFiles[0]
      ? `https://res.cloudinary.com/dsztqh0k7/image/upload/v1709823732/${selectedFiles[0]}`
      : "";
    const result = await createShop(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Le magasin a été crée avec succès");
    form.reset();
    setSelectedFiles([]);
    setOpen(false);
  };

  return (
    <>
      <Heading title={"Ajouté un nouveau magasin"} description={""} />
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
          <div className="flex flex-wrap gap-8">
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
                      type="url"
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
              name="description"
              render={({ field }) => (
                <FormItem className="w-[500px]">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={form.formState.isSubmitting}
                      placeholder="Description du magasin"
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
            Créer
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
