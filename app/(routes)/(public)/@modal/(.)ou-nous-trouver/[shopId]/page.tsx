import ShopPage from "../../../ou-nous-trouver/[shopId]/page";

async function IntercepteShopPage({
  params,
}: {
  params: {
    shopId: string;
  };
}) {
  return <ShopPage params={params} />;
}

export default IntercepteShopPage;
