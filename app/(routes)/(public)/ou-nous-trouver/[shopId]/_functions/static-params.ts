import prismadb from "@/lib/prismadb";

const farmShopId = process.env.NEXT_PUBLIC_FARM_ID;

export async function getStaticParams() {
  const shops = await prismadb.shop.findMany({
    where: {
      isArchived: false,
      id: {
        not: farmShopId,
      },
    },
    select: {
      id: true,
    },
  });
  return shops.map((shop) => ({
    shopId: shop.id,
  }));
}

export interface ShopPageProps {
  params: {
    shopId: string;
  };
}

export async function getShop(id: string) {
  return await prismadb.shop.findUnique({
    where: { id },
    include: { links: true, shopHours: true },
  });
}
