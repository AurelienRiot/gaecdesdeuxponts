import Billboard from "@/components/billboard/billboard";
import ProductCart from "@/components/product-cart";
import ProductCartSkeleton from "@/components/skeleton-ui/product-cart-skeleton";
import Container from "@/components/ui/container";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";
import { Suspense } from "react";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  return {
    title: `Laiterie du Pont Robert - ${decodeURIComponent(params.categoryName)}`,
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const categoryName = decodeURIComponent(params.categoryName);
  return (
    <Container>
      <Billboard categoryName={categoryName} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="lg-gap-x-8 lg:grid lg:grid-cols-5">
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <Suspense
              fallback={
                <div className="md:grid-clos-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {Array(15)
                    .fill(null)
                    .map((_, i) => (
                      <ProductCartSkeleton key={i} />
                    ))}
                </div>
              }
            >
              <FetchProducts categoryName={categoryName} />
            </Suspense>
          </div>
        </div>
      </div>
    </Container>
  );
};

const FetchProducts = async ({ categoryName }: { categoryName: string }) => {
  const products = await prismadb.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
      isArchived: false,
      isPro: false,
    },

    include: { images: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="md:grid-clos-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {products.length > 0 ? (
        products.map((item) => <ProductCart key={item.id} data={item} />)
      ) : (
        <div className="flex h-full w-full items-center justify-center text-neutral-500">
          Aucun produit disponible pour le moment
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
