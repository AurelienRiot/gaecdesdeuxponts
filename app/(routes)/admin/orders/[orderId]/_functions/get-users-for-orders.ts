"server only";
import { getUserName } from "@/components/table-custom-fuction";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import type { Role } from "@prisma/client";
import { unstable_cache } from "next/cache";

async function userPrismaQuery() {
  return await prismadb.user.findMany({
    where: {
      role: { in: ["pro", "user", "trackOnlyUser"] },
    },
    include: { address: true, billingAddress: true, links: true, defaultOrders: { select: { day: true } } },
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
  { revalidate: 60 * 60 * 24, tags: ["users", "defaultOrders"] },
);
export type GetUsersType = Awaited<ReturnType<typeof getUsersForOrders>>;

export type UsersForOrderType = {
  id: string;
  name?: string | null;
  formattedName: string;
  role: Role;
  completed?: boolean;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  image?: string | null;
  address?: string | null;
  links: { label: string; value: string }[];
  defaultDaysOrders: number[];
  notes: string | null;
};
function formatUsers(users: Awaited<ReturnType<typeof userPrismaQuery>>): UsersForOrderType[] {
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
      links: user.links,
      defaultDaysOrders: user.defaultOrders.map((order) => order.day),
      id: user.id,
    };
  });
}
export default getUsersForOrders;
