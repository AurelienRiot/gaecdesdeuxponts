import { getProCategoryByName } from "@/actions/get-category";
import { getProMainProductsByCategoryName } from "@/actions/get-products";
import Billboard from "@/components/billboard/billboard";
import NotFound from "@/components/not-found";
import MainProductCart from "@/components/product/main-product-cart";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import { addDelay } from "@/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  const category = await getProCategoryByName(categoryName);

  return {
    title: categoryName,
    description: category?.description || "",
    openGraph: {
      images: category?.imageUrl,
    },
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const categoryName = decodeURIComponent(params.categoryName);

  const category = await getProCategoryByName(categoryName);
  if (!category) {
    return <NotFound />;
  }
  const products = await getProMainProductsByCategoryName(category.name);

  if (products.length === 0) {
    return <NoResults />;
  }

  if (products.length === 1) {
    redirect(`/profile/produits-pro/category/${category.name}/product/${products[0].name}`);
  }

  await addDelay(2000);

  return (
    <Container>
      <Billboard category={category} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="justify-left mx-auto flex flex-wrap gap-12">
          {products.map((product) => (
            <MainProductCart data={product} key={product.id} />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default CategoryPage;
