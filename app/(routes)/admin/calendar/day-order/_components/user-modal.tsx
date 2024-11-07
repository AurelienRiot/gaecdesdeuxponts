import SelectSheetWithTabs, { sortUserByRole } from "@/components/select-sheet-with-tabs";
import { Plus, User } from "lucide-react";
import { useCallback } from "react";
import type { GetUsersType } from "../_functions/get-users";

function UserModal({ onValueChange, users }: { onValueChange: (value: string) => void; users: GetUsersType }) {
  const sortedUsers = useCallback(() => sortUserByRole(users), [users]);
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
  );
}

export default UserModal;
