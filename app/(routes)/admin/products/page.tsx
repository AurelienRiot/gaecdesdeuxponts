import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { ProductClient } from "./_components/client";
import { ProductColumn } from "./_components/columns";

export const dynamic = "force-dynamic";

const ProductPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imagesUrl[0],
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    isPro: item.isPro,
    price: item.price ? currencyFormatter.format(item.price) : "",
    type: "products",
    category: item.category.name,
    createdAt: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
