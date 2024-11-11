import ButtonBackward from "@/components/ui/button-backward";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DAYS_OF_WEEK } from "@/lib/date-utils";
import getProductsForOrders from "../../../orders/[orderId]/_functions/get-products-for-orders";
import DisplayDefaultOrderForTheDay from "./_components/display-default-order-for-the-day";
import getDefaultOrders from "./_functions/get-default-orders";

export const dynamic = "force-dynamic";

async function DefaultProductsPage({
  params,
}: {
  params: { userId: string | "new" | undefined };
}) {
  const userId = params.userId;
  const user = await getDefaultOrders(userId);
  const products = await getProductsForOrders();
  if (!user || !userId) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }
  return (
    <div className=" space-y-2 " style={{ height: `calc(100dvh - 100px)` }}>
      <div className="max-w-[90vw] md:max-w-[500px] mx-auto flex pt-2 gap-4 items-center justify-between">
        <ButtonBackward />
        <Heading
          title={`Commandes par default par jour pour ${user.company || user.name}`}
          description=""
          className=" w-fit  text-center mx-auto"
          titleClassName=" text-lg sm:text-2xl md:text-3xl"
        />
      </div>
      <Separator />

      <div className="flex flex-row w-full gap-4  overflow-y-hidden mx-auto px-4  overflow-x-scroll relative h-full">
        {DAYS_OF_WEEK.map((day, index) => {
          const defaultOrderForDay = user.defaultOrders.find((dayOrder) => dayOrder.day === index);

          return (
            <DisplayDefaultOrderForTheDay
              userId={userId}
              products={products}
              defaultOrderForDay={defaultOrderForDay}
              index={index}
              day={day}
              key={day}
              role={user.role}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DefaultProductsPage;
