"use client";

import AddressAutocomplete, { type Suggestion } from "@/actions/adress-autocompleteFR";
import { destination, origin } from "@/components/google-events/get-orders-for-events";
import { Button, IconButton, buttonVariants } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import useScrollToHashOnMount from "@/hooks/use-scroll-to-hash";
import useServerAction from "@/hooks/use-server-action";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronsUpDown, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { FaMapLocationDot } from "react-icons/fa6";
import getDirection from "../_actions/get-direction";
import { directionSchema, type DirectionFormValues } from "./direction-schema";

const googleDirectioUrl = process.env.NEXT_PUBLIC_GOOGLE_DIR_URL;

export type UserAndShop = { label: string; address: string; image?: string | null };

export const DirectionForm = ({ usersAndShops }: { usersAndShops: UserAndShop[] }) => {
  const { serverAction } = useServerAction(getDirection);
  const [open, setOpen] = useState(false);
  const [reorderedWaypoints, setReorderedWaypoints] = useState<string[]>([]);
  useScrollToHashOnMount();

  const title = "Faire un trajet obtimisé";
  const action = "Obtenir le trajet obtimisé";

  const form = useForm<DirectionFormValues>({
    resolver: zodResolver(directionSchema),
    defaultValues: {
      origin,
      destination,
      waypoints: [
        "",
        "",
        // "3, le Clos Cheny, 44290, Guémené-Penfao, FR",
        // "7 Rue de l'Eglise 44290 Guémené-Penfao",
        // "1 Rue de l'Hotel de Ville 44290 Guémené-Penfao",
        // "6 Rue de Plessé, 44460, Avessac, FR",
        // "17 Place Nominoë, 35600, Bains-sur-Oust, FR",
      ],
    },
  });

  const waypoints = form.watch("waypoints");

  const onSubmit = async (data: DirectionFormValues) => {
    function onSuccess(result?: number[]) {
      if (result) {
        const reordered = result.map((index) => waypoints[index]);
        setReorderedWaypoints(reordered);
        setOpen(true);
        form.setValue("waypoints", reordered);
      }
    }
    await serverAction({ data, onSuccess, toastOptions: { position: "top-center" } });
  };

  return (
    <div className="space-y-6 pt-6 flex justify-center  w-full ">
      <div className="mb-8  space-y-4 ">
        <div id="opti" className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-center"> {title} </h2>
        </div>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))} className="w-full space-y-8">
            <SuccessModal
              isOpen={open}
              onClose={() => setOpen(false)}
              usersAndShops={usersAndShops}
              reorderedWaypoints={reorderedWaypoints}
            />
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Départ</FormLabel>
                  <FormControl>
                    <AddressModal
                      onValueChange={field.onChange}
                      usersAndShops={usersAndShops}
                      value={field.value}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <WaypointsForm usersAndShops={usersAndShops} />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <AddressModal onValueChange={field.onChange} usersAndShops={usersAndShops} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormButton className="w-full">{action}</FormButton>
          </form>
        </Form>
      </div>
    </div>
  );
};

function SuccessModal({
  isOpen,
  onClose,
  reorderedWaypoints,
  usersAndShops,
}: { isOpen: boolean; onClose: () => void; reorderedWaypoints: string[]; usersAndShops: UserAndShop[] }) {
  const form = useFormContext<DirectionFormValues>();
  const ori = form.watch("origin");
  const dest = form.watch("destination");

  const directionString = `${googleDirectioUrl}/${ori}/${reorderedWaypoints.join("/")}/${dest}`;

  return (
    <Modal title="Trajet obtimisé" description="Le trajet obtimisé a été généré." isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <Link
          href={directionString}
          target="_blank"
          className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200"
        >
          <FaMapLocationDot className="h-5 w-5 mr-3" />
          Accéder au trajet optimisé
        </Link>
        {reorderedWaypoints.map((value, index) => {
          const image = usersAndShops.find((shop) => shop.address === value)?.image;
          const label = usersAndShops.find((shop) => shop.address === value)?.label;
          return (
            <div className="flex gap-1 justify-center items-center" key={index + value}>
              <div
                className={cn(buttonVariants({ variant: "default", size: "icon" }), "bg-green-500 hover:bg-green-600")}
              >
                {index + 1}
              </div>

              <div
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  " w-full text-left overflow-hidden whitespace-nowrap pl-2 relative flex justify-start",
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white from-85%" />
                <Image
                  src={image ? image : "/skeleton-image.webp"}
                  alt={"image"}
                  width={24}
                  height={24}
                  className="mr-2 h-4 w-4 object-contain rounded-sm"
                />
                <span className=""> {value ? (label ? label : value) : "Entrer une adresse"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

function WaypointsForm({ usersAndShops }: { usersAndShops: UserAndShop[] }) {
  const form = useFormContext<DirectionFormValues>();

  const error = form.control.getFieldState("waypoints").error;

  function addWaypoint() {
    form.setValue("waypoints", [...form.getValues("waypoints"), ""]);
  }

  function removeWaypoint(index: number) {
    const waypoints = form.getValues("waypoints");
    waypoints.splice(index, 1);
    form.setValue("waypoints", waypoints);
  }
  return (
    <FormField
      control={form.control}
      name="waypoints"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Points de passages</FormLabel>

          <FormControl>
            <div className="space-y-4">
              {field.value.map((value, index) => (
                <FormField
                  key={index + value}
                  control={form.control}
                  name={`waypoints.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <IconButton
                            Icon={X}
                            onClick={() => removeWaypoint(index)}
                            className="absolute -top-2 -right-2 size-4 p-px text-destructive-foreground bg-destructive z-10"
                          />
                          <AddressModal
                            onValueChange={field.onChange}
                            usersAndShops={usersAndShops}
                            value={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                onClick={addWaypoint}
                variant={"outline"}
                className="border-dashed w-full border-primary "
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un point
              </Button>
            </div>
          </FormControl>
          {!!error?.root && <p className={cn("text-sm font-medium text-destructive")}>{error.root.message}</p>}
        </FormItem>
      )}
    />
  );
}

type AddressModalProps = {
  onValueChange: (address: string) => void;
  usersAndShops: UserAndShop[];
  value: string;
};

const AddressModal = forwardRef<HTMLButtonElement, AddressModalProps>(
  ({ usersAndShops, onValueChange, value }, ref) => {
    const form = useFormContext<DirectionFormValues>();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value);

    function onClose(val: string) {
      setInput(val);
      onValueChange(val);
      setOpen(false);
      form.clearErrors();
    }

    const image = usersAndShops.find((u) => u.address === value)?.image;
    const label = usersAndShops.find((u) => u.address === value)?.label;

    return (
      <>
        <Button
          type={"button"}
          variant="outline"
          className={cn(" w-full text-left  pl-2 relative flex justify-start", !value ? "opacity-50" : "")}
          onClick={() => setOpen(true)}
          ref={ref}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-background from-85%" />
          <Image
            src={image ? image : "/skeleton-image.webp"}
            alt={"image"}
            width={24}
            height={24}
            className="mr-2 h-4 w-4 object-contain rounded-sm"
          />
          <span className="overflow-hidden whitespace-nowrap">
            {" "}
            {value ? (label ? label : value) : "Entrer une adresse"}
          </span>
        </Button>
        <Modal
          className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[700px]  rounded-sm"
          title=""
          description=""
          isOpen={open}
          onClose={() => onClose(input)}
        >
          <div className="space-y-4">
            <AddressSelect usersAndShops={usersAndShops} onValueChange={onClose} />
            <AddressSearch onValueChange={onClose} />
            <Input
              placeholder="adresse"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
            />
          </div>
        </Modal>
      </>
    );
  },
);
AddressModal.displayName = "AddressModal";

function AddressSelect({
  usersAndShops,
  onValueChange,
}: { usersAndShops: UserAndShop[]; onValueChange: (address: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          id="select-address"
          // disabled={form.formState.isSubmitting}
          className={cn("w-full justify-between")}
        >
          Rechercher un client
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" avoidCollisions={false} className=" z-[1200] p-0   ">
        <Command>
          <CommandInput onFocus={() => ScrollToTarget("select-address")} placeholder="Nom du client" />
          <CommandList>
            {usersAndShops.map((item) => (
              <CommandItem
                key={item.address}
                value={item.address}
                keywords={[item.label]}
                onSelect={() => {
                  onValueChange(item.address);
                  setOpen(false);
                }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={16}
                    height={16}
                    className="mr-2 object-contain rounded-sm"
                  />
                )}
                {item.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function AddressSearch({ onValueChange }: { onValueChange: (address: string) => void }) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([] as Suggestion[]);
  const [query, setQuery] = useState("");

  const setSearchTerm = async (value: string) => {
    setQuery(value);
    const temp = await AddressAutocomplete(value).catch((e) => {
      console.log(e);
      return [];
    });
    setSuggestions(temp);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={"search-address"}
          variant="outline"
          role="combobox"
          onClick={() => setOpen((open) => !open)}
          className={cn(" justify-between active:scale-100 w-full font-normal text-muted-foreground")}
        >
          Rechercher votre adresse
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[1200]" side="bottom" align="start">
        <Command loop shouldFilter={false} className="w-full">
          <CommandInput
            onFocus={() => ScrollToTarget("search-address")}
            placeholder="Entrer l'adresse..."
            className="h-9 w-full"
            value={query}
            onValueChange={(e) => {
              setSearchTerm(e);
              setOpen(true);
            }}
          />
          <CommandList className="w-full">
            {query.length > 3 && <CommandEmpty>Adresse introuvable</CommandEmpty>}
            {suggestions.map((suggestion, index) => (
              <CommandItem
                className="cursor-pointer
                          bg-popover  text-popover-foreground w-full"
                value={suggestion.label + index}
                key={suggestion.label}
                onSelect={() => {
                  onValueChange(suggestion.label);

                  setOpen(false);
                }}
              >
                {suggestion.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}