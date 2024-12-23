import ButtonBackward from "@/components/ui/button-backward";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import type { DefaultOrderProduct } from "@prisma/client";
import { getAllShops } from "../../../direction/_functions/get-shops";
import getProductsForOrders, {
  type ProductsForOrdersType,
} from "../../../orders/[orderId]/_functions/get-products-for-orders";
import ChangeUser from "./_components/change-user";
import { DefaultOrderModalProvider, type DefaultOrderProps, ModalTrigger } from "./_components/default-order-modal";
import FavoriteProducts from "./_components/favorite-products";
import getDefaultOrders from "./_functions/get-default-orders";
import { addDelay } from "@/lib/utils";

export const dynamic = "force-dynamic";

const emptyOrder = (day: number, userId: string): DefaultOrderProps => ({
  confirmed: true,
  day,
  defaultOrderProducts: [],
  shopId: null,
  userId,
});

const formateProducts = (products: ProductsForOrdersType, defaultOrderProducts: DefaultOrderProduct[]) =>
  defaultOrderProducts.map((product) => {
    const correspondingProduct = products.find((p) => p.id === product.productId);
    return {
      name: correspondingProduct?.name || "",
      icon: correspondingProduct?.icon || "",
      quantity: product.quantity,
      price: product.price,
      id: product.productId,
      unit: correspondingProduct?.unit,
    };
  });
async function DefaultOrdersPage(props: {
  params: Promise<{ userId: string | "new" | undefined }>;
}) {
  await addDelay(2000);
  const params = await props.params;
  const userId = params.userId;
  const [user, shops, products] = await Promise.all([getDefaultOrders(userId), getAllShops(), getProductsForOrders()]);

  if (!user || !userId) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }

  const generalDefaultOrder = user.defaultOrders.find((order) => order.day === -1);

  const favoriteProducts = user.favoriteProducts.map((product) => product.productId);
  const filteredProducts = products.filter(
    (product) =>
      user.role === "trackOnlyUser" || (user.role === "pro" ? product.product.isPro : !product.product.isPro),
  );
  return (
    <div className=" space-y-4 h-full pb-10">
      <div className=" bg-background">
        <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex py-2 gap-4 items-center justify-between">
          <ButtonBackward />
          <FavoriteProducts userId={userId} products={filteredProducts} favoriteProducts={favoriteProducts} />
          <ChangeUser userId={userId} />
        </div>
        <Separator />
      </div>
      <DefaultOrderModalProvider favoriteProducts={favoriteProducts} products={filteredProducts} shops={shops}>
        <div className="flex flex-wrap items-center justify-center gap-4  px-4  relative h-full">
          <ModalTrigger
            key={"generalDefaultOrder"}
            day={-1}
            defaultOrder={generalDefaultOrder || emptyOrder(-1, userId)}
            products={
              generalDefaultOrder ? formateProducts(filteredProducts, generalDefaultOrder.defaultOrderProducts) : []
            }
          />
          {DAYS_OF_WEEK.map((_, index) => {
            const day = (index + 1) % 7;
            const defaultOrder = user.defaultOrders.find((dayOrder) => dayOrder.day === day) || emptyOrder(day, userId);
            const defaultOrderProducts = formateProducts(filteredProducts, defaultOrder.defaultOrderProducts);
            return <ModalTrigger key={day} day={day} defaultOrder={defaultOrder} products={defaultOrderProducts} />;
          })}
        </div>
      </DefaultOrderModalProvider>
    </div>
  );
}

export default DefaultOrdersPage;
