import NotFound from "@/app/not-found";
import Gallery from "@/components/gallery/gallery";
import Info from "@/components/info";
import ProductList from "@/components/products-list";
import Container from "@/components/ui/container";
import prismadb from "@/lib/prismadb";
import { mergeWithoutDuplicates } from "@/lib/utils";
import { Metadata } from "next";

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
    title: `GAEC des deux ponts - ${product?.name}`,
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
      isArchived: false,
    },
    include: {
      category: true,
      images: { orderBy: { createdAt: "asc" } },
      linkedBy: { select: { id: true, name: true, isArchived: true } },
      linkedProducts: { select: { id: true, name: true, isArchived: true } },
    },
  });

  if (!product) {
    return <NotFound />;
  }

  const linkProducts = mergeWithoutDuplicates(
    product.linkedBy.filter((product) => !product.isArchived),
    product.linkedProducts.filter((product) => !product.isArchived),
  );

  const excludeIds = linkProducts.map((product) => product.id);
  excludeIds.push(product.id);

  const suggestedProducts = await prismadb.product.findMany({
    where: {
      AND: [
        { categoryId: product.categoryId, isArchived: false },
        {
          id: {
            notIn: excludeIds,
          },
        },
      ],
    },
    include: {
      category: true,
      images: { orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <Container>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Gallery images={product.images} />
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <Info data={product} linkProducts={linkProducts} />
          </div>
        </div>
        <hr className="my-10" />
        <ProductList title="Produits Similaires" items={suggestedProducts} />
      </div>
    </Container>
  );
};

export default ProductPage;
