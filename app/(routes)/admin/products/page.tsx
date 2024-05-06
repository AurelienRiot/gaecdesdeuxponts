import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";
import { ProductClient } from "./_components/client";
import { ProductColumn } from "./_components/columns";

export const dynamic = "force-dynamic";

const ProductPage = async () => {
  const products = await prismadb.mainProduct.findMany({
    include: {
      products: {
        include: {
          options: true,
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
    productOptions: item.products.map((product) => {
      return {
        price: product.price,
        options: product.options.map((option) => ({
          name: option.name,
          value: option.value,
        })),
      };
    }),
    optionsName: item.products
      .map((product) =>
        product.options
          .map((option) => `${option.name}: ${option.value}`)
          .join(", "),
      )
      .join(", "),
    imageUrl: item.imagesUrl[0],
    isArchived: item.isArchived,
    isPro: item.isPro,
    type: "products",
    category: item.categoryName,
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
