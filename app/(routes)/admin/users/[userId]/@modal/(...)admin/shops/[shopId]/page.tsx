import ShopsPage from "@/app/(routes)/admin/shops/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage(props: {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{
    userId: string | undefined;
  }>;
}) {
  const fixSearchParams = { ...props.params, ...props.searchParams };
  return <ShopsPage params={props.params} searchParams={fixSearchParams} />;
}

export default IntercepteShopPage;
