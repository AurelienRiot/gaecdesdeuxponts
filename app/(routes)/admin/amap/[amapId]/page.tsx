import prismadb from "@/lib/prismadb";
import { AMAPForm } from "./_components/amap-form";
import AMAPFormulairePage from "./_components/amap-formulaire/formulaire-page";

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
    prismadb.user.findMany({ where: { role: { in: ["user", "trackOnlyUser"] } } }),
    await prismadb.shop.findMany({ where: { type: "amap" }, orderBy: { createdAt: "desc" } }),
    prismadb.product.findMany({ where: { productName: "Produits AMAP" } }),
  ]);
  if (params.amapId === "formulaire") {
    return <AMAPFormulairePage shops={shops} products={products} />;
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AMAPForm initialData={amapOrder} users={users} shops={shops} products={products} />
      </div>
    </div>
  );
};

export default AMAPFormPage;
