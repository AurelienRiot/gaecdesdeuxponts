import ShopsPage from "../../../shops/[shopId]/page";

export const dynamic = "force-dynamic";

async function IntercepteShopPage(props: {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{
    userId: string | undefined;
  }>;
}) {
  return <ShopsPage params={props.params} searchParams={props.searchParams} />;
}

export default IntercepteShopPage;
