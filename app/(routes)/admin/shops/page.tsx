import prismadb from "@/lib/prismadb";
import DisplayShop from "./components/shops";

const ShopPage = async () => {
  const shops = await prismadb.shop.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DisplayShop data={shops} />
      </div>
    </div>
  );
};

export default ShopPage;
