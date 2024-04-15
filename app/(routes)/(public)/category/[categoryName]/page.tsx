import Billboard from "@/components/billboard/billboard";
import Container from "@/components/ui/container";
import { Metadata } from "next";
import DisplayProducts from "./_components/display-products";

interface CategoryPageProps {
  params: {
    categoryName: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(params.categoryName)} - Laiterie du Pont Robert`,
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
            <DisplayProducts categoryName={categoryName} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CategoryPage;
