import { ProductWithOptionsAndMain } from "@/types";
import ProductCart from "./product/product-cart";

import NoResults from "./ui/no-results";

interface ProductListProps {
  title: string;
  items: ProductWithOptionsAndMain[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  return (
    <div id={title} className="space-y-10 py-20">
      <h2 className="text-center text-3xl font-bold text-primary lg:text-5xl ">
        {" "}
        {title}{" "}
      </h2>
      <div className="flex flex-wrap justify-center gap-12">
        {items.length === 0 ? (
          <NoResults />
        ) : (
          items.map((item) => <ProductCart data={item} key={item.id} />)
        )}
      </div>
    </div>
  );
};

export default ProductList;
