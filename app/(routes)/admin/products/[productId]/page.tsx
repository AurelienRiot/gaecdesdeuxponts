import { ProductForm } from "./_components/product-form";
import { getCategoriesForProducts } from "./_functions/get-categories";
import { getMainProduct } from "./_functions/get-main-product";
import { getOptions } from "./_functions/get-options";
import { getStocksForProducts } from "./_functions/get-stocks";

const ProductPage = async ({ params }: { params: { productId: string | undefined } }) => {
  const [mainProduct, categories, stocks, options] = await Promise.all([
    getMainProduct(params.productId),
    getCategoriesForProducts(),
    getStocksForProducts(),
    getOptions(),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm stocks={stocks} categories={categories} initialData={mainProduct} optionsArray={options} />
      </div>
    </div>
  );
};

export default ProductPage;
