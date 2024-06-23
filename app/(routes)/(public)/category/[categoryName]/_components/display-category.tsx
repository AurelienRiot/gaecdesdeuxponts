import Billboard from "@/components/billboard/billboard";
import  type { MainProductWithProducts } from "@/types";
import  type { Category } from "@prisma/client";
import DisplayProducts from "./display-products";

const DisplayCategory = ({
  category,
  products,
}: {
  category: Category;
  products: MainProductWithProducts[];
}) => {
  return (
    <>
      <Billboard category={category} />
      <div className="px-4 pb-24 sm:px-6 lg:px-8">
        <DisplayProducts products={products} />
      </div>
    </>
  );
};

export default DisplayCategory;
