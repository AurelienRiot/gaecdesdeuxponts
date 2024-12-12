import getShops from "@/actions/get-shops";
import { InfiniteMovingCards } from "@/components/animations/infinite-moving-cards";

export const PartenaireCards = async () => {
  const { shops } = await getShops();
  const firstFiveShops = shops.slice(0, 5);
  const secondFiveShops = shops.slice(5, 10);
  const thirdFiveShops = shops.slice(10, 15);
  return (
    <div
      id="partenaires"
      className="relative flex flex-col  items-center justify-center overflow-hidden rounded-md pt-24  "
    >
      <h3 className="text-3xl">Nos Partenaires</h3>
      <InfiniteMovingCards items={firstFiveShops} direction="right" speed="slow" />
      <InfiniteMovingCards items={secondFiveShops} direction="left" speed="normal" />
      <InfiniteMovingCards items={thirdFiveShops} direction="right" speed="slow" />
    </div>
  );
};
