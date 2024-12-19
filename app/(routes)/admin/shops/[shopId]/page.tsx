import ShopForm from "./_components/shop-form";
import getShop from "./_functions/get-shop";

const ShopsPage = async (
  props: {
    params: Promise<{ shopId: string }>;
    searchParams: Promise<{
      userId: string | undefined;
    }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const shop = await getShop({ params, searchParams });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShopForm initialData={shop} />
      </div>
    </div>
  );
};

export default ShopsPage;
