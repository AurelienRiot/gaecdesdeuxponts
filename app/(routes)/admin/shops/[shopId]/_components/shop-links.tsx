"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ShopFormValues } from "./shop-schema";
import { linkNames } from "@/components/react-icons/links";

function ShopLinks() {
  const form = useFormContext<ShopFormValues>();
  const links = form.watch("links");

  function removeEmailField(index: number) {
    const newLinks = links.filter((_, i) => i !== index);
    form.setValue("links", newLinks);
  }

  function addEmailField() {
    form.setValue("links", [...links, { label: "", value: "" }]);
  }

  return (
    <div className="space-y-2 w-56">
      <Label>Liens</Label>
      {links.map((_, index) => (
        <div key={index} className="space-y-3">
          <FormField
            control={form.control}
            name={`links.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input value={field.value} onChange={field.onChange} placeholder="facebook.com" required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2 ">
            <FormField
              control={form.control}
              name={`links.${index}.label`}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    {/* <Input value={field.value} onChange={field.onChange} placeholder="nom" required /> */}
                    <ValueInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeEmailField(index)}
              aria-label="Remove link"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addEmailField} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Lien
      </Button>
    </div>
  );
}

function ValueInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [openValue, setOpenValue] = useState(false);
  const Icon = linkNames.find(({ label }) => label === value)?.Icon;
  return (
    <Popover open={openValue} onOpenChange={setOpenValue}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", value ? "" : "text-muted-foreground")}
        >
          <div className="flex flex-row items-center gap-2">
            {Icon && <Icon className=" size-4 " />}
            {value ? value : "nom"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-[1200]">
        <Command>
          <CommandInput value={search} onValueChange={setSearch} placeholder="Nom de la valeur" />
          <CommandList>
            {linkNames.map(({ label, Icon }) => (
              <CommandItem
                key={label}
                value={label}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpenValue(false);
                  setSearch("");
                }}
              >
                <Icon className="mr-2 size-4 " />
                {label}
              </CommandItem>
            ))}
            {!!search && (
              <CommandItem
                value={search}
                className="cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onSelect={() => {
                  onChange(search);
                  setOpenValue(false);
                  setSearch("");
                }}
              >
                {`Créer "${search}"`}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ShopLinks;
