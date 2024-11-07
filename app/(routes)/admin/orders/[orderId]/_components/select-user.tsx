import SelectSheetWithTabs, { sortUserByRole } from "@/components/select-sheet-with-tabs";
import { getUserName } from "@/components/table-custom-fuction";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import type { UsersForOrderType } from "../_functions/get-users-for-orders";
import type { OrderFormValues } from "./order-schema";

const SelectUser = ({ users }: { users: UsersForOrderType[] }) => {
  const form = useFormContext<OrderFormValues>();
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user ? getUserName(user) : undefined;
  })();
  const image = users.find((user) => user.id === userId)?.image;

  function onValueChange(value: string) {
    const user = users.find((user) => user.id === value);

    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    // if (!user.completed) {
    //   router.push(`/admin/users/${user.id}?incomplete=true`);
    //   toast.error("Utilisateur incomplet", { position: "top-center" });
    //   return;
    // }
    form.setValue("userId", value);
  }

  const sortedUsers = useCallback(() => sortUserByRole(users), [users]);

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
            tabs={[
              { value: "pro", label: "Professionnel" },
              { value: "user", label: "Particulier" },
              { value: "trackOnlyUser", label: "Suivie uniquement" },
            ]}
            tabsValues={sortedUsers()}
            onSelected={(value) => {
              onValueChange(value.key);
            }}
          />

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectUser;
