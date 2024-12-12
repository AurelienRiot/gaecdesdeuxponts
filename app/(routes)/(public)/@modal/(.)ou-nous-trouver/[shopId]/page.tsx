import type { ShopPageProps } from "../../../ou-nous-trouver/[shopId]/_functions/static-params";
import ShopPage from "../../../ou-nous-trouver/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage({ params }: ShopPageProps) {
  return <ShopPage params={params} />;
}

export default IntercepteShopPage;
