import NotFound from "@/app/not-found";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/info";
import ProductList from "@/components/products-list";
import Container from "@/components/ui/container";
import { Metadata } from "next";
import prismadb from "@/lib/prismadb";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  return {
    title: `RIOT TECH - ${product?.name}`,
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      category: true,
      images: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!product) {
    return <NotFound />;
  }

  const suggestedProducts = await prismadb.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: {
        not: product.id,
      },
    },
    include: {
      category: true,
      images: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <div className="gb-white">
      <Container>
        <div className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <Gallery images={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <Info data={product} />
            </div>
          </div>
          <hr className="my-10" />
          <ProductList title="Produits Similaires" items={suggestedProducts} />
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
