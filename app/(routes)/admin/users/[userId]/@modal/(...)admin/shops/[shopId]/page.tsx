import ShopsPage from "@/app/(routes)/admin/shops/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage({
  params,
  searchParams,
}: {
  params: { shopId: string };
  searchParams: {
    userId: string | undefined;
  };
}) {
  console.log({ params, searchParams });
  return <ShopsPage params={params} searchParams={searchParams} />;
}

export default IntercepteShopPage;
