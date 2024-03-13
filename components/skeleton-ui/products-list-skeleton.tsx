import ProductCart from "./product-cart-skeleton";

const ProductList = ({ title }: { title: string }) => {
  return (
    <div className="space-y-4 ">
      <h2 className="text-3xl font-bold text-primary ">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <ProductCart key={i} />
          ))}
      </div>
    </div>
  );
};

export default ProductList;
