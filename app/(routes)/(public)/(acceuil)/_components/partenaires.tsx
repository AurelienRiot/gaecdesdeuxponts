import getShops from "@/actions/get-shops";
import { InfiniteMovingCards } from "@/components/animations/infinite-moving-cards";

export const PartenaireCards = async () => {
  const { shops } = await getShops();
  const thirdLength = Math.ceil(shops.length / 3);
  const firstThirdShops = shops.slice(0, thirdLength);
  const secondThirdShops = shops.slice(thirdLength, thirdLength * 2);
  const lastThirdShops = shops.slice(thirdLength * 2, shops.length);
  return (
    <div
      id="partenaires"
      className="relative flex flex-col  items-center justify-center overflow-hidden rounded-md pt-24  "
    >
      <h3 className="text-3xl">Nos Partenaires</h3>
      <InfiniteMovingCards items={firstThirdShops} direction="right" speed="slow" />
      <InfiniteMovingCards items={secondThirdShops} direction="left" speed="normal" />
      <InfiniteMovingCards items={lastThirdShops} direction="right" speed="slow" />
    </div>
  );
};
