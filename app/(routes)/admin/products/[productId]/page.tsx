import prismadb from "@/lib/prismadb";
import { ProductForm } from "./_components/product-form";
import { getAllOptions } from "@/components/product/product-function";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const mainProduct = await prismadb.mainProduct.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      products: {
        include: { options: { orderBy: { index: "asc" } } },
        orderBy: { index: "asc" },
      },
    },
  });

  const categories = await prismadb.category.findMany();

  const options = await prismadb.option.findMany({
    select: {
      name: true,
      value: true,
    },
  });

  const mappedGroupedOptions = getAllOptions(options);
  mappedGroupedOptions.forEach((option, index) => {
    mappedGroupedOptions[index] = {
      name: option.name,
      values: option.values.some((value) => value === "Personnalisé")
        ? option.values
        : [...option.values, "Personnalisé"],
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categories} initialData={mainProduct} optionsArray={mappedGroupedOptions} />
      </div>
    </div>
  );
};

export default ProductPage;
