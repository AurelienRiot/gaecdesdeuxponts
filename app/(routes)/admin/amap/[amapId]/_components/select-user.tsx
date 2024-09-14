import SelectSheet from "@/components/select-sheet";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { getUserName } from "../../../orders/[orderId]/_components/select-user";
import type { AMAPFormValues } from "./amap-schema";

const SelectUser = ({ users }: { users: User[] }) => {
  const form = useFormContext<AMAPFormValues>();
  const router = useRouter();
  const userId = form.watch("userId");
  const name = (() => {
    const user = users.find((user) => user.id === userId);
    return user?.company || user?.name || user?.email?.split("@")[0];
  })();

  function onValueChange(value: string) {
    const user = users.find((user) => user.id === value);

    if (!user) {
      toast.error("Utilisateur introuvable");
      return;
    }
    if (!user.completed) {
      router.push(`/admin/users/${user.id}?incomplete=true`);
      toast.error("Utilisateur incomplet", { position: "top-center" });
      return;
    }
    form.setValue("userId", value);
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem className="w-48">
          <FormLabel id="user-input">Client</FormLabel>
          <SelectSheet
            triggerClassName="w-full"
            title="Selectionner le client"
            trigger={
              name ? (
                <Button variant="outline" className="w-full">
                  <NameWithImage name={name} displayImage={false} />
                </Button>
              ) : (
                "Nom de client"
              )
            }
            selectedValue={userId}
            values={users.map((user) => ({
              label: <NameWithImage name={getUserName(user)} displayImage={false} />,
              value: user.id,
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

export default SelectUser;
