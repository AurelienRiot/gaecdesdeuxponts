"use client";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/info";
import ProductList from "@/components/products-list";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import { useProductsContext } from "@/context/products-context";
import { mergeWithoutDuplicates } from "@/lib/utils";

const ClientWrapper = ({ productName }: { productName: string }) => {
  const { products } = useProductsContext();

  if (!products) {
    return <NoResults />;
  }
  const product = products.find((product) => product.name === productName);

  if (!product) {
    return <NoResults />;
  }

  const linkProducts = mergeWithoutDuplicates(
    product.linkedBy,
    product.linkedProducts,
  );
  const excludeIds = linkProducts.map((product) => product.id);
  excludeIds.push(product.id);

  const suggestedProducts = products.filter((p) => {
    return (
      p.categoryId === product.categoryId && !excludeIds.includes(product.id)
    );
  });

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <Gallery images={product.images} />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <Info data={product} linkProducts={linkProducts} />
        </div>
      </div>
      <hr className="my-10" />
      {suggestedProducts.length > 0 && (
        <ProductList title="Produits Similaires" items={suggestedProducts} />
      )}
    </div>
  );
};

export default ClientWrapper;
