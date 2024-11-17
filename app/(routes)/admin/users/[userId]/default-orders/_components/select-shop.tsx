import type { AllShopsType } from "@/app/(routes)/admin/direction/_functions/get-shops";
import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { DefaultOrderFormValues } from "./schema";

const SelectShop = ({ shops }: { shops: AllShopsType }) => {
  const form = useFormContext<DefaultOrderFormValues>();
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
  }

  return (
    <FormField
      control={form.control}
      name="shopId"
      render={({ field }) => (
        <FormItem className=" mb-4 flex items-center justify-center">
          <SelectSheet
            triggerClassName="w-full "
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
            defaultValue={"À domicile"}
            values={shops.map((shop) => ({
              label: <NameWithImage name={shop.name} image={shop.imageUrl} />,
              value: { key: shop.id },
            }))}
            onSelected={(value) => {
              onValueChange(value?.key);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectShop;