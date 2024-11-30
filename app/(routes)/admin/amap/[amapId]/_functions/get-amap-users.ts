"server only";

import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

const getAmapUsers = unstable_cache(
  async () => {
    return await prismadb.user.findMany({
      where: { role: { in: ["user", "trackOnlyUser"] } },
      orderBy: { createdAt: "asc" },
    });
  },
  ["getAmapUsers"],
  {
    revalidate: 60 * 60 * 24 * 7,
    tags: ["users"],
  },
);

export default getAmapUsers;
