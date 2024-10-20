import { getProductsByCategoryName } from "@/actions/get-products";
import Gallery from "@/components/gallery/gallery";
import NotFound from "@/components/not-found";
import Info from "@/components/product/info";
import MainProductCart from "@/components/product/main-product-cart";
import { findProduct, getAllOptions } from "@/components/product/product-function";
import type { MainProduct } from "@prisma/client";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    productName: string;
    categoryName: string;
  };
  searchParams: { [key: string]: string | undefined };
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const productName = decodeURIComponent(params.productName);
  const categoryName = decodeURIComponent(params.categoryName);

  const { products, optionsArray } = await getProduct({ productName, categoryName });
  const product = findProduct({ products, optionsArray, searchParams });

  return {
    title: product?.name || "",
    description: product?.description || "",
    openGraph: {
      images: product ? [...product.imagesUrl, ...product.product.imagesUrl] : "",
    },
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params, searchParams }) => {
  const productName = decodeURIComponent(params.productName);
  const categoryName = decodeURIComponent(params.categoryName);

  const { products, optionsArray, uniqueProducts } = await getProduct({
    productName,
    categoryName,
  });

  const product = findProduct({ products, optionsArray, searchParams });

  if (products.length === 0) {
    return <NotFound />;
  }

  if (!product) {
    return <NotFound />;
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:justify-center lg:gap-8">
        <Gallery images={[...product.product.imagesUrl, ...product.imagesUrl]} />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:justify-self-start">
          <Info sameProducts={products} product={product} optionsArray={optionsArray} />
        </div>
      </div>
      <hr className="my-10" />
      {uniqueProducts.length > 0 && (
        <div className="space-y-10 py-20">
          <h2 className="text-center text-3xl font-bold text-primary lg:text-5xl">
            Autres produits de la categorie {product.product.categoryName}
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {uniqueProducts.map((item) => (
              <MainProductCart data={item} key={item.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;

const getProduct = unstable_cache(
  async ({ categoryName, productName }: { categoryName: string; productName: string }) => {
    const allProducts = await getProductsByCategoryName(categoryName);

    const products = allProducts.filter((product) => product.productName === productName);
    const optionsArray = getAllOptions(
      products.flatMap((product) =>
        product.options.flatMap((option) => ({
          name: option.name,
          value: option.value,
        })),
      ),
    );

    const suggestedProducts = allProducts.filter((product) => product.productName !== productName);

    const uniqueProductsName = Array.from(new Set(suggestedProducts.map((product) => product.productName)));

    const uniqueProducts: MainProduct[] = [];
    uniqueProductsName.map((productName) => {
      const first = suggestedProducts.find((product) => product.productName === productName)?.product;
      if (first) uniqueProducts.push(first);
    });

    return { products, optionsArray, uniqueProducts };
  },
  ["getProduct"],
  { revalidate: 60 * 60 * 24, tags: ["products", "categories"] },
);
