import ShopPage, { type ShopPageProps } from "../../../ou-nous-trouver/[shopId]/page";

async function IntercepteShopPage(props: ShopPageProps) {
  return <ShopPage params={props.params} />;
}

export default IntercepteShopPage;
