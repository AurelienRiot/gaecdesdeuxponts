import { CategoriesProProvider } from "@/context/categories-context";
import { ProductsProProvider } from "@/context/products-context";

const ProduitsProLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <CategoriesProProvider>
      <ProductsProProvider>{children}</ProductsProProvider>
    </CategoriesProProvider>
  );
};

export default ProduitsProLayout;
