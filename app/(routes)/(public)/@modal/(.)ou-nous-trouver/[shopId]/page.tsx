import type { Metadata } from "next";
import {
  getShop,
  getStaticParams,
  type ShopPageProps,
} from "../../../ou-nous-trouver/[shopId]/_functions/static-params";
import ShopPage from "../../../ou-nous-trouver/[shopId]/page";

export async function generateStaticParams() {
  return await getStaticParams();
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const shop = await getShop(params.shopId);

  return {
    title: shop?.name,
    description: shop?.description,
    openGraph: {
      images: shop?.imageUrl || "",
    },
  };
}

async function IntercepteShopPage({ params }: ShopPageProps) {
  return <ShopPage params={params} />;
}

export default IntercepteShopPage;
