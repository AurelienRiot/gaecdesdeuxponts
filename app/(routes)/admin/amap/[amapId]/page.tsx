import prismadb from "@/lib/prismadb";
import { AMAPForm } from "./_components/amap-form";
import AMAPFormulairePage from "./_components/amap-formulaire/formulaire-page";
import getAmapProducts from "./_functions/get-amap-products";
import getAmapUsers from "./_functions/get-amap-users";
import getAmapShops from "./_functions/get-amap-shops";

export const dynamic = "force-dynamic";

const AMAPFormPage = async (props: { params: Promise<{ amapId: string }> }) => {
  const params = await props.params;
  const [amapOrder, users, shops, products] = await Promise.all([
    prismadb.aMAPOrder.findUnique({
      where: {
        id: params.amapId,
      },
      include: {
        amapItems: true,
      },
    }),
    getAmapUsers(),
    getAmapShops(),
    getAmapProducts(),
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
