import prismadb from "@/lib/prismadb";
import { AMAPForm } from "./_components/amap-form";

export const dynamic = "force-dynamic";

const CategoryPage = async ({ params }: { params: { amapId: string } }) => {
  const category = await prismadb.aMAPOrder.findUnique({
    where: {
      id: params.amapId,
    },
    include: {
      amapItems: true,
    },
  });

  const users = await prismadb.user.findMany({ where: { role: "user" } });

  const shops = await prismadb.shop.findMany({ where: { type: "amap" } });

  const products = await prismadb.product.findMany({ where: { productName: "Produits AMAP" } });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AMAPForm initialData={category} users={users} shops={shops} products={products} />
      </div>
    </div>
  );
};

export default CategoryPage;
