"use client";
import SelectSheetWithTabs, { sortUserByRole } from "@/components/select-sheet-with-tabs";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

function ChangeUser() {
  const { data: users } = useUsersQuery();
  const router = useRouter();
  const sortedUsers = useCallback(() => (users ? sortUserByRole(users) : []), [users]);
  return (
    <SelectSheetWithTabs
      triggerClassName="w-fit whitespace-nowrap"
      title="Selectionner le client"
      trigger={"Changer de client"}
      tabs={[
        { value: "pro", label: "Professionnel" },
        { value: "user", label: "Particulier" },
        { value: "trackOnlyUser", label: "Suivie uniquement" },
      ]}
      tabsValues={sortedUsers()}
      onSelected={({ key }) => {
        router.push(`/admin/users/${key}/default-orders`);
      }}
    />
  );
}

export default ChangeUser;
