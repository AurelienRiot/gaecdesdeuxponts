import Gallery from "@/components/skeleton-ui/gallery-skeleton";
import Info from "@/components/skeleton-ui/info-skeleton";
import { ProductListSkeleton } from "@/components/skeleton-ui/products-list-skeleton";

const LoadingPage = () => (
  <div className="px-4 py-10 sm:px-6 lg:px-8">
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <Gallery />
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <Info />
      </div>
    </div>
    <hr className="my-10" />
    <ProductListSkeleton title="Produits Similaires" />
  </div>
);
export default LoadingPage;
