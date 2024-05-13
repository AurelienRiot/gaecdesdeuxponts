import { getProductsByCategoryName } from "@/actions/get-products";
import { getAllOptions } from "@/app/(routes)/admin/products/[productId]/page";
import { Metadata } from "next";
import ClientWrapper from "./_components/client-wraper";
import NotFound from "@/components/not-found";
import { MainProduct } from "@prisma/client";

interface ProductPageProps {
  params: {
    productName: string;
    categoryName: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(params.productName)} - Laiterie du Pont Robert`,
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const productName = decodeURIComponent(params.productName);
  const categoryName = decodeURIComponent(params.categoryName);

  const allProducts = await getProductsByCategoryName(categoryName);

  const products = allProducts.filter(
    (product) => product.productName === productName,
  );

  if (products.length === 0) {
    return <NotFound />;
  }

  const suggestedProducts = allProducts.filter(
    (product) => product.productName !== productName,
  );

  const uniqueProductsName = Array.from(
    new Set(suggestedProducts.map((product) => product.productName)),
  );

  const uniqueProducts: MainProduct[] = [];
  uniqueProductsName.map((productName) => {
    const first = suggestedProducts.find(
      (product) => product.productName === productName,
    )?.product;
    if (first) uniqueProducts.push(first);
  });

  const optionsArray = getAllOptions(
    products.flatMap((product) =>
      product.options.flatMap((option) => ({
        name: option.name,
        value: option.value,
      })),
    ),
  );

  return (
    <ClientWrapper
      products={products}
      suggestedProducts={uniqueProducts}
      optionsArray={optionsArray}
    />
  );
};

export default ProductPage;
