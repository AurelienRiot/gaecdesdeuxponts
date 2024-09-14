import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Shop } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { OrderFormValues } from "./order-shema";
import Image from "next/image";
import { ScrollToTarget } from "@/lib/scroll-to-traget";
import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";

const SelectShop = ({ shops }: { shops: Shop[] }) => {
  const form = useFormContext<OrderFormValues>();
  const [open, setOpen] = useState(false);
  const shopId = form.watch("shopId");
  const shop = shops.find((shop) => shop.id === shopId);

  function onValueChange(value: string | undefined) {
    if (!value) {
      form.setValue("shopId", undefined);
      return;
    }
    const shop = shops.find((shop) => shop.id === value);
    if (!shop) {
      toast.error("Magasin introuvable");
      return;
    }
    form.setValue("shopId", value);
    setOpen(false);
  }

  return (
    <FormField
      control={form.control}
      name="shopId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel id="shop-input" className="flex items-center justify-between gap-2">
            <span>Lieu de retrait/livraison</span>
            <Button
              variant={"outline"}
              onClick={() => onValueChange(undefined)}
              type="button"
              size={"xs"}
              className="border-dashed text-xs whitespace-nowrap"
            >
              À domicile
            </Button>
          </FormLabel>
          <SelectSheet
            triggerClassName="w-full"
            title="Selectionner le lieu de retrait"
            trigger={
              shop ? (
                <Button variant="outline">
                  <NameWithImage name={shop.name} image={shop.imageUrl} />
                </Button>
              ) : (
                "À domicile"
              )
            }
            selectedValue={shopId}
            values={shops.map((shop) => ({
              label: <NameWithImage name={shop.name} image={shop.imageUrl} />,
              value: shop.id,
            }))}
            onSelected={(value) => {
              onValueChange(value);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectShop;
