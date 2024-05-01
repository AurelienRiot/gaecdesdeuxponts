"use client";

import Gallery from "@/components/gallery/gallery";
import Info from "@/components/info";
import ButtonBackward from "@/components/ui/button-backward";
import NoResults from "@/components/ui/no-results";
import { useProductsContext } from "@/context/products-context";
import { useParams } from "next/navigation";
import Loading from "../../../product/[productName]/loading";

const DisplayProduct = () => {
  const { products } = useProductsContext();
  const params = useParams();

  if (!products) {
    return <Loading />;
  }

  const productName = params["productName"] as string;
  const product = products?.find(
    (item) => item.name === decodeURIComponent(productName),
  );

  if (!product) {
    return <NoResults className="mt-20" />;
  }

  return (
    <div className="w-full space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <ButtonBackward url={`/dashboard-user/produits-pro`} />
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <Gallery images={product.imagesUrl} />
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <Info data={product} />
        </div>
      </div>
    </div>
  );
};

export default DisplayProduct;
