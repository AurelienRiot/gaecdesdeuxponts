import { Metadata } from "next";
import ClientWrapper from "./_components/client-wraper";
import {
  getProProductsByCategoryName,
  getProductsByCategoryName,
} from "@/actions/get-products";
import { getAllOptions } from "@/app/(routes)/admin/products/[productId]/page";
import NotFound from "@/components/not-found";

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

  const allProducts = await getProProductsByCategoryName(categoryName);

  const products = allProducts.filter(
    (product) => product.productName === productName,
  );

  if (products.length === 0) {
    return <NotFound />;
  }

  const suggestedProducts = allProducts.filter(
    (product) => product.productName !== productName,
  );

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
      suggestedProducts={suggestedProducts.slice(0, 4)}
      optionsArray={optionsArray}
    />
  );
};

export default ProductPage;
