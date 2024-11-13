"use client";
import SelectSheetWithTabs, { sortUserByRole } from "@/components/select-sheet-with-tabs";
import { NameWithImage } from "@/components/table-custom-fuction/common-cell";
import { Button } from "@/components/ui/button";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

function ChangeUser({ userId }: { userId: string }) {
  const { data: users } = useUsersQuery();
  const router = useRouter();
  const sortedUsers = useCallback(() => (users ? sortUserByRole(users) : []), [users]);
  const user = users?.find((user) => user.id === userId);
  return (
    <SelectSheetWithTabs
      triggerClassName="w-fit whitespace-nowrap"
      title="Selectionner le client"
      trigger={
        user ? (
          <Button variant="outline" className="w-fit ">
            <NameWithImage className="font-bold" name={user.formattedName} image={user.image} />
          </Button>
        ) : (
          "Changer de client"
        )
      }
      tabs={[
        { value: "pro", label: "Professionnel" },
        { value: "user", label: "Particulier" },
        { value: "trackOnlyUser", label: "Suivie uniquement" },
      ]}
      selectedValue={userId}
      tabsValues={sortedUsers()}
      onSelected={({ key }) => {
        router.push(`/admin/users/${key}/default-orders`);
      }}
    />
  );
}

export default ChangeUser;
