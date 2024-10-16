import { getUserName } from "@/components/table-custom-fuction";
import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getUsersForOrders = unstable_cache(
  async () => {
    const users = await prismadb.user
      .findMany({
        where: {
          NOT: {
            role: { in: ["admin", "deleted", "readOnlyAdmin"] },
          },
        },
        include: {
          address: true,
          billingAddress: true,
        },
      })
      .then((users) =>
        users.sort((a, b) => {
          const aName = getUserName(a);
          const bName = getUserName(b);
          return aName.localeCompare(bName, "fr", {
            sensitivity: "base",
          });
        }),
      );
    return users;
  },
  ["getUsersForOrders"],
  { revalidate: 60 * 60 * 24, tags: ["users"] },
);

export default getUsersForOrders;
