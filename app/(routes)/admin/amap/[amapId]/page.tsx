import prismadb from "@/lib/prismadb";
import { AMAPForm } from "./_components/amap-form";

export const dynamic = "force-dynamic";

const AMAPFormPage = async ({ params }: { params: { amapId: string } }) => {
  const [amapOrder, users, shops, products] = await Promise.all([
    prismadb.aMAPOrder.findUnique({
      where: {
        id: params.amapId,
      },
      include: {
        amapItems: true,
      },
    }),
    prismadb.user.findMany({ where: { role: "user" } }),
    prismadb.shop.findMany({ where: { type: "amap" } }),
    prismadb.product.findMany({ where: { productName: "Produits AMAP" } }),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AMAPForm initialData={amapOrder} users={users} shops={shops} products={products} />
      </div>
    </div>
  );
};

export default AMAPFormPage;
