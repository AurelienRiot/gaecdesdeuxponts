import ButtonBackward from "@/components/ui/button-backward";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import getProductsForOrders from "../../../orders/[orderId]/_functions/get-products-for-orders";
import ChangeUser from "./_components/change-user";
import DisplayDefaultOrderForTheDay from "./_components/display-default-order-for-the-day";
import getDefaultOrders from "./_functions/get-default-orders";
import { getAllShops } from "../../../direction/_functions/get-shops";
import FavoriteProducts from "./_components/favorite-products";

export const dynamic = "force-dynamic";

async function DefaultProductsPage({
  params,
}: {
  params: { userId: string | "new" | undefined };
}) {
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

  const favoriteProducts = user.favoriteProducts.map((product) => product.productId);
  const filteredProducts = products.filter(
    (product) =>
      user.role === "trackOnlyUser" || (user.role === "pro" ? product.product.isPro : !product.product.isPro),
  );
  return (
    <div className=" space-y-2 h-full">
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between ">
        <ButtonBackward />
        <FavoriteProducts userId={userId} products={filteredProducts} favoriteProducts={favoriteProducts} />
        <ChangeUser userId={userId} />
      </div>
      {/* <Heading
        title={`${user.company || user.name}`}
        description=""
        className=" w-fit  text-center mx-auto"
        titleClassName="text-base xs:text-lg sm:text-2xl md:text-3xl"
      /> */}
      <Separator />

      <div className="flex flex-row w-full gap-4  overflow-y-hidden mx-auto px-4  overflow-x-scroll relative h-full">
        {DAYS_OF_WEEK.map((day, index) => {
          const defaultOrderForDay = user.defaultOrders.find((dayOrder) => dayOrder.day === index);

          return (
            <DisplayDefaultOrderForTheDay
              userId={userId}
              products={filteredProducts}
              shops={shops}
              defaultOrderForDay={defaultOrderForDay}
              index={index}
              day={day}
              key={day}
              favoriteProducts={favoriteProducts}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DefaultProductsPage;
