"server only";
import { getUserName } from "@/components/table-custom-fuction";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import type { Address, BillingAddress, Link, Role, User } from "@prisma/client";
import { unstable_cache } from "next/cache";

const getUsersForOrders = unstable_cache(
  async () => {
    const users = await prismadb.user.findMany({
      where: {
        role: { in: ["pro", "user", "trackOnlyUser"] },
      },
      include: { address: true, billingAddress: true, links: true },
    });
    return formatUsers(users).sort((a, b) => {
      return a.formattedName.localeCompare(b.formattedName, "fr", {
        sensitivity: "base",
      });
    });
  },
  ["getUsers"],
  { revalidate: 60 * 60 * 24, tags: ["users"] },
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
  notes: string | null;
};
function formatUsers(
  users: (User & { address: Address | null; billingAddress: BillingAddress | null; links: Link[] })[],
): UsersForOrderType[] {
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
      id: user.id,
    };
  });
}
export default getUsersForOrders;

// import { getUserName } from "@/components/table-custom-fuction";
// import prismadb from "@/lib/prismadb";
// import { unstable_cache } from "next/cache";

// const getUsersForOrders = unstable_cache(
//   async () => {
//     const users = await prismadb.user
//       .findMany({
//         where: {
//           NOT: {
//             role: { in: ["admin", "deleted", "readOnlyAdmin"] },
//           },
//         },
//         include: {
//           address: true,
//           billingAddress: true,
//         },
//       })
//       .then((users) =>
//         users.sort((a, b) => {
//           const aName = getUserName(a);
//           const bName = getUserName(b);
//           return aName.localeCompare(bName, "fr", {
//             sensitivity: "base",
//           });
//         }),
//       );
//     return users;
//   },
//   ["getUsersForOrders"],
//   { revalidate: 60 * 60 * 24, tags: ["users"] },
// );

// export default getUsersForOrders;
