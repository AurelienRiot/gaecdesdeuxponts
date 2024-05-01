import prismadb from "@/lib/prismadb";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  const categories = await prismadb.category.findMany();

  // const accessibleImages = await Promise.all(
  //   (product?.images || []).filter(Boolean).map(async (image) => {
  //     const check = await checkIfUrlAccessible(image.url);
  //     if (check) {
  //       return image;
  //     }
  //   })
  // );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categories} initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
