import { createId } from "@/lib/id";
import { MainProductForm } from "./_components/main-product-form";
import { NewOptionButton, NewProductButton, OptionButton, ProductButton } from "./_components/modal-button";
import { OptionModalProvider } from "./_components/option-modal";
import { ProductModalProvider } from "./_components/product-modal";
import ReorderOptions from "./_components/reorder-options";
import ReorderProducts from "./_components/reorder-products";
import { getCategoriesForProducts } from "./_functions/get-categories";
import { getMainProduct } from "./_functions/get-main-product";
import { getOptions } from "./_functions/get-options";
import { getStocksForProducts } from "./_functions/get-stocks";

export const dynamic = "force-dynamic";

const ProductPage = async ({ params }: { params: { productId: string | undefined } }) => {
  const [mainProduct, categories, stocks, optionsArray] = await Promise.all([
    getMainProduct(params.productId),
    getCategoriesForProducts(),
    getStocksForProducts(),
    getOptions(),
  ]);

  const initialData = {
    id: mainProduct?.id || createId("mainProduct"),
    name: mainProduct?.name || "",
    imagesUrl: mainProduct?.imagesUrl || [],
    categoryName: mainProduct?.categoryName || "",
    productSpecs: mainProduct?.productSpecs || "",
    isArchived: mainProduct?.isArchived || false,
    isPro: mainProduct?.isPro || false,
  };
  const products =
    mainProduct && mainProduct.products.length > 0
      ? mainProduct.products
          .map((product) => ({
            id: product.id,
            mainProductId: mainProduct.id,
            index: product.index,
            name: product.name,
            description: product.description,
            price: product.price,
            tax: product.tax,
            unit: product.unit || undefined,
            stocks: product.stocks.map((stock) => stock.stockId) || [],
            isFeatured: product.isFeatured,
            isArchived: product.isArchived,
            imagesUrl: product.imagesUrl,
            icon: product.icon,
            options: product.options.map((option) => ({
              id: option.id,
              index: option.index,
              name: option.name,
              value: option.value,
            })),
          }))
          .sort((a, b) => a.index - b.index)
      : null;

  const options =
    products && products[0].options.length > 0
      ? products[0].options
          .map((option) => ({
            id: option.id,
            name: option.name,
            index: option.index,
            optionIds: products
              .map((product) => product.options.find((o) => o.name === option.name)?.id)
              .filter((o) => typeof o === "string"),
          }))
          .sort((a, b) => a.index - b.index)
      : null;

  if (!mainProduct) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MainProductForm categories={categories} initialData={initialData} newProduct={!mainProduct} />
      </div>
    );
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MainProductForm categories={categories} initialData={initialData} newProduct={!mainProduct} />
        {products && (
          <OptionModalProvider optionsArray={optionsArray} productIds={products.map((product) => product.id)}>
            <>
              <h3 className="text-xl font-semibold flex items-center gap-3">
                <ReorderOptions options={options} /> Options
              </h3>
              {options && (
                <div className="flex flex-wrap items-center justify-left gap-4">
                  {options.map((option) => (
                    <OptionButton key={option.name + option.index} option={option} />
                  ))}
                </div>
              )}
              <NewOptionButton index={options?.length || 0} />
            </>
          </OptionModalProvider>
        )}
        <ProductModalProvider optionsArray={optionsArray} stocks={stocks}>
          <>
            {products && (
              <>
                <h3 className="text-xl font-semibold flex items-center gap-3">
                  <ReorderProducts products={products} />
                  Produits{" "}
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  {products.map((product, index) => (
                    <ProductButton key={product.id} product={product} index={index} />
                  ))}
                </div>
              </>
            )}
            <NewProductButton index={products?.length || 0} mainProductId={initialData.id} options={options} />
          </>
        </ProductModalProvider>
        {/* {mainProduct && <ProductWithOptions optionsArray={options} stocks={stocks} initialProducts={products} />} */}
      </div>
    </div>
  );
};

export default ProductPage;
