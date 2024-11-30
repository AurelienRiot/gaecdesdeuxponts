import SelectSheetWithTabs, { getUserTab } from "@/components/select-sheet-with-tabs";
import { getUserName } from "@/components/table-custom-fuction";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { NameWithImage } from "@/components/user";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type { OrderFormValues } from "./order-schema";

const SelectUser = ({ users }: { users: UserForOrderType[] }) => {
  const form = useFormContext<OrderFormValues>();
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user ? getUserName(user) : undefined;
  })();
  const image = users.find((user) => user.id === userId)?.image;

  const { tabs, tabsValue } = useMemo(() => getUserTab(users), [users]);

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem className=" flex flex-col gap-2 ">
          <FormLabel id="user-input">Client</FormLabel>
          <SelectSheetWithTabs
            triggerClassName="w-full"
            title="Selectionner le client"
            trigger={
              name ? (
                <Button variant="outline" className="w-full">
                  <NameWithImage name={name} image={image} />
                </Button>
              ) : (
                "Nom de client"
              )
            }
            selectedValue={userId}
            tabs={tabs}
            tabsValues={tabsValue}
            onSelected={({ key }) => {
              field.onChange(key);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectUser;
