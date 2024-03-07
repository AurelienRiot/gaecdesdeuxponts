import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const ProductPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
      images: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.images[0].url,
    isFeatured: item.isFeatured ? "oui" : "non",
    isArchived: item.isArchived ? "oui" : "non",
    price: formatter.format(item.price),
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
