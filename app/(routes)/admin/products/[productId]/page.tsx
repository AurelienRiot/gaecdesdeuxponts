import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: {
        orderBy: {
          createdAt: "asc",
        },
      },
      linkedProducts: { select: { id: true, name: true } },
      linkedBy: { select: { id: true, name: true } },
    },
  });

  const categories = await prismadb.category.findMany();

  const products = await prismadb.product.findMany({
    select: {
      id: true,
      name: true,
      categoryId: true,
    },
  });

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
        <ProductForm
          categories={categories}
          initialData={product}
          products={products}
        />
      </div>
    </div>
  );
};

export default ProductPage;
