import ShopForm from "./_components/shop-form";
import getShop from "./_functions/get-shop";

const ShopsPage = async ({
  params,
  searchParams,
}: {
  params: { shopId: string };
  searchParams: {
    userId: string | undefined;
  };
}) => {
  console.log({ params, searchParams });
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
