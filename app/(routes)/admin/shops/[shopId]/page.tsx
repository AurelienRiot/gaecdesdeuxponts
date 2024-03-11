import prismadb from "@/lib/prismadb";
import ShopForm from "./components/shop-form";

const CategoryPage = async ({ params }: { params: { shopId: string } }) => {
  const shop = await prismadb.shop.findUnique({
    where: {
      id: params.shopId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShopForm initialData={shop} />
      </div>
    </div>
  );
};

export default CategoryPage;
