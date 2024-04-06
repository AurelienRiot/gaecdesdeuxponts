import prismadb from "@/lib/prismadb";

const getShops = async () => {
  const shops = await prismadb.shop.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return shops;
};

export default getShops;
