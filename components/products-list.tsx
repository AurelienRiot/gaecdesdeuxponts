import NoResults from "./ui/no-results";
import ProductCart from "./product-cart";
import { VisibleElement } from "./animations/visible-element";
import { ProductWithCategoryAndImages } from "@/types";

interface ProductListProps {
  title: string;
  items: ProductWithCategoryAndImages[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  return (
    <div className="space-y-4 ">
      <VisibleElement as="h2" className="text-3xl font-bold text-primary ">
        {" "}
        {title}{" "}
      </VisibleElement>
      {items.length === 0 && <NoResults />}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ProductCart data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
