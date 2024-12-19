import NoResults from "@/components/ui/no-results";
import { OrderTable } from "../_components/order-table";
import getAllOrders from "./_functions/get-all-orders";
import Container from "@/components/ui/container";

export const dynamic = "force-dynamic";

async function AllOrdersPage(
  props: {
    params: Promise<{ userId: string | "new" | undefined }>;
  }
) {
  const params = await props.params;
  if (!params.userId || params.userId === "new") {
    return <NoResults text="Utilisateur introuvable" />;
  }
  const allOrders = await getAllOrders(params.userId);

  return (
    <Container className="py-4 px-6">
      <OrderTable data={allOrders} />
    </Container>
  );
}

export default AllOrdersPage;
