"server only";
import { getUserName } from "@/components/table-custom-fuction";
import type { UserForOrderType } from "@/components/zod-schema/user-for-orders-schema";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import { unstable_cache } from "next/cache";

async function userPrismaQuery() {
  return await prismadb.user.findMany({
    where: {
      role: { in: ["pro", "user", "trackOnlyUser"] },
    },
    include: {
      address: true,
      billingAddress: true,
      shop: { include: { links: true, shopHours: { orderBy: { day: "asc" } } } },
      defaultOrders: { select: { day: true } },
    },
  });
}

const getUsersForOrders = unstable_cache(
  async () => {
    const users = await userPrismaQuery();
    return formatUsers(users).sort((a, b) => {
      return a.formattedName.localeCompare(b.formattedName, "fr", {
        sensitivity: "base",
      });
    });
  },
  ["getUsers"],
  { revalidate: 60 * 60 * 24, tags: ["users", "defaultOrders", "shops"] },
);

function formatUsers(users: Awaited<ReturnType<typeof userPrismaQuery>>): UserForOrderType[] {
  return users.map((user) => {
    return {
      name: user.name,
      formattedName: getUserName(user),
      role: user.role,
      email: user.email,
      company: user.company,
      completed: user.completed,
      image: user.image,
      phone: user.phone,
      address: addressFormatter(user.address, false),
      notes: user.notes,
      links: user.shop?.links || [],
      shopHours: user.shop?.shopHours || [],
      defaultDaysOrders: user.defaultOrders.map((order) => order.day),
      id: user.id,
    };
  });
}
export default getUsersForOrders;
