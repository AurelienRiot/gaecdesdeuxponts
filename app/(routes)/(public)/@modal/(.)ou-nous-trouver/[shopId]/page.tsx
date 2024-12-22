import ShopPage, { type ShopPageProps } from "../../../ou-nous-trouver/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage(props: ShopPageProps) {
  return <ShopPage params={props.params} />;
}

export default IntercepteShopPage;
