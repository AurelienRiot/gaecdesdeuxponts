import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { currencyFormatter, mergeWithoutDuplicates } from "@/lib/utils";

const ProductPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
      images: {
        orderBy: {
          createdAt: "asc",
        },
      },
      linkedProducts: { select: { id: true, name: true } },
      linkedBy: { select: { id: true, name: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.images[0].url,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: currencyFormatter.format(item.price),
    linkProducts: mergeWithoutDuplicates(
      item.linkedProducts,
      item.linkedBy,
    ).map((product) => ({
      id: product.id,
      name: product.name,
    })),
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
