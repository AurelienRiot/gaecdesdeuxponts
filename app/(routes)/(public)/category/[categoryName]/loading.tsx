import BillboardSkeleton from "@/components/skeleton-ui/billboard-skeleton";
import { ProductCart } from "@/components/skeleton-ui/product-cart-skeleton";
import Container from "@/components/ui/container";

const LoadingPage = () => (
  <Container>
    <BillboardSkeleton />
    <div className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="lg-gap-x-8 lg:grid lg:grid-cols-5">
        <div className="mt-6 lg:col-span-4 lg:mt-0">
          <div className="md:grid-clos-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array(15)
              .fill(null)
              .map((_, i) => (
                <ProductCart key={i} />
              ))}
          </div>
        </div>
      </div>
    </div>
  </Container>
);
export default LoadingPage;
