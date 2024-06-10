import prismadb from "@/lib/prismadb";
import { ProductForm } from "./_components/product-form";

export type OptionsArray = {
  name: string;
  values: string[];
}[];

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
      values: [...option.values, "Personnalisé", "Aucun"],
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          initialData={mainProduct}
          optionsArray={mappedGroupedOptions}
        />
      </div>
    </div>
  );
};

export default ProductPage;

export const getAllOptions = (
  options: {
    name: string;
    value: string;
  }[],
) => {
  const groupedOptions = options.reduce<Record<string, string[]>>(
    (acc, option) => {
      if (!acc[option.name]) {
        acc[option.name] = [];
      }
      if (!acc[option.name].includes(option.value)) {
        acc[option.name].push(option.value);
      }
      return acc;
    },
    {},
  );

  const mappedGroupedOptions: OptionsArray = Object.entries(groupedOptions).map(
    ([key, value]) => ({
      name: key,
      values: value,
    }),
  );

  return mappedGroupedOptions;
};
