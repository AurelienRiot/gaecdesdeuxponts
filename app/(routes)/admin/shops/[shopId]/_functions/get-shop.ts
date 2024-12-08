"server only";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import type { FullShop, Nullable } from "@/types";

async function getShop({
  params,
  searchParams,
}: {
  params: { shopId: string };
  searchParams: {
    userId: string | undefined;
  };
}) {
  let shop: Nullable<FullShop> | null = null;
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
  return shop;
}

export default getShop;
