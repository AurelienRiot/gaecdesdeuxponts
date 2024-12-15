import SelectSheetWithTabs, { getUserTab } from "@/components/select-sheet-with-tabs";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import { Plus, User } from "lucide-react";
import { useMemo } from "react";

function UserModal({ onValueChange, users }: { onValueChange: (value: string) => void; users: UserForOrderType[] }) {
  const { tabs, tabsValue } = useMemo(() => getUserTab(users), [users]);
  return (
    <SelectSheetWithTabs
      triggerClassName="w-full"
      title="Selectionner le client"
      trigger={
        <button type="button" className=" p-2 h-fit border bg-blue-500 rounded-full cursor-pointer flex gap-2">
          <Plus className="size-4 text-blue-100 stroke-[3]" />
          <User className="size-4 text-blue-100 stroke-[3]" />
        </button>
      }
      selectedValue={null}
      tabs={tabs}
      tabsValues={tabsValue}
      onSelected={(selected) => {
        if (selected) {
          onValueChange(selected.key);
        }
      }}
    />
  );
}

export default UserModal;
