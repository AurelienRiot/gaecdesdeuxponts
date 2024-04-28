import { ProductCart } from "./product-cart-skeleton";

export const ProductList = ({ title }: { title: string }) => {
  return (
    <div className="space-y-4 ">
      <h2 className="text-center text-3xl font-bold text-primary lg:text-5xl ">
        {title}
      </h2>

      <div className="flex flex-wrap justify-center gap-12">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <ProductCart key={i} />
          ))}
      </div>
    </div>
  );
};
