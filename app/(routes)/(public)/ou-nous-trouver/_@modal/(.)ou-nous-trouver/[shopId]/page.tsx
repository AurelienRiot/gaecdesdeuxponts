import ShopPage from "../../../ou-nous-trouver/[shopId]/page";

export const dynamic = "force-dynamic";

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
