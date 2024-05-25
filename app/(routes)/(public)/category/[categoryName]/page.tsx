import { getCategoryByName } from "@/actions/get-category";
import { getMainProductsByCategoryName } from "@/actions/get-products";
import Billboard from "@/components/billboard/billboard";
import NotFound from "@/components/not-found";
import MainProductCart from "@/components/product/main-product-cart";
import NoResults from "@/components/ui/no-results";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  const category = await getCategoryByName(categoryName);

  return {
    title: categoryName,
    openGraph: {
      title: categoryName,
      description: category?.description || "",
      images: category?.imageUrl,
    },
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params }) => {
  const categoryName = decodeURIComponent(params.categoryName);

  const category = await getCategoryByName(categoryName);
  if (!category) {
    return <NotFound />;
  }
  const products = await getMainProductsByCategoryName(category.name);

  if (products.length === 0) {
    return <NoResults />;
  }

  if (products.length === 1) {
    redirect(`/category/${category.name}/product/${products[0].name}`);
  }

  return (
    <>
      <Billboard category={category} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="justify-left mx-auto flex flex-wrap gap-12">
          {products.map((product) => (
            <MainProductCart data={product} key={product.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
