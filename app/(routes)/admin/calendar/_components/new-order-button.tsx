"use client";

import DateModal from "@/components/date-modal";
import SelectSheetWithTabs, { getUserTab } from "@/components/select-sheet-with-tabs";
import { Package, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { createNewOrderUrl } from "../../orders/[orderId]/_components/new-order-button";
import { useUsersQuery } from "../../../../../hooks/use-query/users-query";
import { Skeleton } from "@/components/skeleton-ui/skeleton";

function NewOrderButton() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const { data: users } = useUsersQuery();

  const onDayClick = async (date?: Date) => {
    if (!date) {
      toast.error("Veuillez choisir une date");
      return;
    }
    if (!users) {
      toast.error("Les utilisateurs n'ont pas été chargés, veuillez recharger la page");
      return;
    }
    setSelectedDate(new Date(date.setHours(10, 0, 0, 0)));
    setIsUserSelectOpen(true);
  };

  const handleUserSelected = (userId: string) => {
    if (!selectedDate) {
      toast.error("Veuillez choisir une date");
      return;
    }

    const url = createNewOrderUrl({
      date: selectedDate,
      userId: userId,
    });
    router.push(url);
  };

  return (
    <>
      <DateModal
        onValueChange={onDayClick}
        triggerClassName="p-2 h-fit border bg-green-500 transition-colors hover:bg-green-400 rounded-full cursor-pointer flex gap-2 w-fit"
        trigger={
          <>
            <Plus className="size-4 text-green-100 stroke-[3]" />
            <Package className="size-4 text-green-100 stroke-[3]" />
          </>
        }
      />
      <SelectUser open={isUserSelectOpen} onOpenChange={setIsUserSelectOpen} onUserSelected={handleUserSelected} />
    </>
  );
}

function SelectUser({
  open,
  onOpenChange,
  onUserSelected,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSelected: (userId: string) => void;
}) {
  const { data: users } = useUsersQuery();
  const { tabs, tabsValue } = useMemo(() => (users ? getUserTab(users) : { tabs: [], tabsValue: [] }), [users]);

  return (
    <SelectSheetWithTabs
      open={open}
      onOpenChange={onOpenChange}
      triggerClassName="hidden"
      title="Selectionner le client"
      tabs={tabs}
      tabsValues={tabsValue}
      onSelected={(selected) => {
        if (selected) {
          onUserSelected(selected.key);
        }
      }}
      isSearchable
    />
  );
}

export default NewOrderButton;
