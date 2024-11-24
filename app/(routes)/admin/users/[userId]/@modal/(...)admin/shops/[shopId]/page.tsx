import ShopsPage from "@/app/(routes)/admin/shops/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage({
  params,
  searchParams,
}: {
  params: { shopId: string };
  searchParams: {
    userId: string | undefined;
    name: string | undefined;
    image: string | undefined;
  };
}) {
  return <ShopsPage params={params} searchParams={searchParams} />;
}

export default IntercepteShopPage;
