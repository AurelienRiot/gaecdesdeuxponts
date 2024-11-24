import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import ShopForm, { type ShopPageType } from "./_components/shop-form";

const ShopsPage = async ({
  params,
  searchParams,
}: {
  params: { shopId: string };
  searchParams: {
    userId: string | undefined;
  };
}) => {
  let shop: ShopPageType = null;
  if (params.shopId === "new" && searchParams.userId) {
    const user = await prismadb.user.findUnique({
      where: {
        id: searchParams.userId,
      },
      include: { address: true },
    });
    shop = {
      userId: searchParams.userId,
      name: user?.company,
      imageUrl: user?.image,
      address: user?.address ? addressFormatter(user?.address, false) : null,
      lat: user?.address?.latitude,
      long: user?.address?.longitude,
      email: user?.email,
      phone: user?.phone,
    };
  } else {
    shop = await prismadb.shop.findUnique({
      where: {
        id: params.shopId,
      },
      include: { links: true, shopHours: { orderBy: { day: "asc" } } },
    });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShopForm initialData={shop} />
      </div>
    </div>
  );
};

export default ShopsPage;
