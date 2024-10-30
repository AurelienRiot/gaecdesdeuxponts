import { Heading } from "@/components/ui/heading";
import { getUsersWithOrders } from "../_functions/get-users-with-orders";
import { Separator } from "@/components/ui/separator";
import GroupedInvoice from "./_components/grouped-invoice";

async function SendInvoicesPage() {
  const allUsers = await getUsersWithOrders();

  return (
    <div className="space-y-4 p-6">
      <div className="flex justify-between flex-wrap items-center">
        <Heading title={`Factures`} description={`Envoie groupé de facture`} />
      </div>
      <Separator />
      <GroupedInvoice userWithOrdersForInvoices={allUsers} />
    </div>
  );
}

export default SendInvoicesPage;
