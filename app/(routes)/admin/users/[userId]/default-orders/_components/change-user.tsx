"use client";
import SelectSheetWithTabs, { getUserTab } from "@/components/select-sheet-with-tabs";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { NameWithImage } from "@/components/user";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function ChangeUser({ userId }: { userId: string }) {
  const { data: users } = useUsersQuery();
  const router = useRouter();

  const { tabs, tabsValue } = useMemo(() => (users ? getUserTab(users) : { tabs: [], tabsValue: [] }), [users]);
  if (!users) {
    return <Skeleton className="rounded-md h-8 w-16" size={"icon"} />;
  }
  const user = users.find((user) => user.id === userId);
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
      tabs={tabs}
      selectedValue={userId}
      tabsValues={tabsValue}
      onSelected={({ key }) => {
        router.push(`/admin/users/${key}/default-orders`);
      }}
    />
  );
}

export default ChangeUser;
