import NotFound from "@/app/not-found";
import Billboard from "@/components/billboard/billboard";
import ProductCart from "@/components/product-cart";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  return {
    title: `GAEC des deux ponts - ${decodeURIComponent(params.categoryName)}`,
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const categoryName = decodeURIComponent(params.categoryName);
  const products = await prismadb.product.findMany({
    where: {
      category: {
        name: categoryName,
      },
      isArchived: false,
      isPro: true,
    },

    include: { images: { orderBy: { createdAt: "asc" } } },
  });
  if (products.length === 0) {
    return <NotFound />;
  }

  return (
    <Container>
      <Billboard categoryName={categoryName} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="lg-gap-x-8 lg:grid lg:grid-cols-5">
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <div className="md:grid-clos-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {products.length > 0 ? (
                products.map((item) => (
                  <ProductCart key={item.id} data={item} />
                ))
              ) : (
                <NoResults />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CategoryPage;
