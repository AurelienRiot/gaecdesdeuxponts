"use client";

import { useMemo, useState } from "react";
import type { InvoiceColumn } from "./columns";
import { InvoiceCard } from "./invoice-card";
import { useUsersQuery } from "@/hooks/use-query/users-query";
import SelectSheetWithTabs, { getUserTab } from "@/components/select-sheet-with-tabs";
import { Button } from "@/components/ui/button";
import { NameWithImage } from "@/components/user";
import NoResults from "@/components/ui/no-results";

function CardFilter({ invoices }: { invoices: InvoiceColumn[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  const filteredInvoices = userId ? invoices.filter((invoice) => invoice.userId === userId) : invoices;

  return (
    <div className="space-y-4">
      <UserIdFilter userId={userId} setUserId={setUserId} />
      <div className="flex flex-wrap gap-4 justify-center">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => <InvoiceCard key={invoice.id} data={invoice} />)
        ) : (
          <NoResults text="Aucune facture trouvée" />
        )}
      </div>
    </div>
  );
}

export default CardFilter;

function UserIdFilter({
  userId,
  setUserId,
}: { userId: string | null; setUserId: React.Dispatch<React.SetStateAction<string | null>> }) {
  const { data: users } = useUsersQuery();
  const { tabs, tabsValue } = useMemo(() => (users ? getUserTab(users) : { tabs: [], tabsValue: [] }), [users]);

  const user = users?.find((user) => user.id === userId);

  function onSelected(id?: string) {
    if (!id) {
      setUserId(null);
    } else {
      setUserId(id);
    }
  }

  return (
    <SelectSheetWithTabs
      title="Selectionner le client"
      trigger={
        <Button type="button" variant={"outline"}>
          {userId ? (
            user ? (
              <NameWithImage name={user?.formattedName} image={user?.image} />
            ) : (
              "Client inconnu"
            )
          ) : (
            "Nom de client"
          )}
        </Button>
      }
      tabs={tabs}
      defaultValue={"Tous les clients"}
      tabsValues={tabsValue}
      onSelected={(selected) => {
        onSelected(selected?.key);
      }}
      isSearchable
    />
  );
}
