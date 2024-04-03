import prismadb from "@/lib/prismadb";
import { getTime } from "date-fns";

const getShops = async () => {
  const init = getTime(new Date());
  const shops = await prismadb.shop.findMany({
    where: {
      isArchived: false,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const finish = getTime(new Date());
  console.log(finish - init);

  console.log(shops[0].name);
  return shops;
};

export default getShops;
