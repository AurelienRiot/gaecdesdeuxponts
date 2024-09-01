import prismadb from "@/lib/prismadb";
import { unstable_cache } from "next/cache";

export const getSearchUsers = unstable_cache(
  async () => {
    return await prismadb.user.findMany({
      where: { role: { notIn: ["readOnlyAdmin", "admin", "deleted"] } },
      orderBy: {
        updatedAt: "desc",
      },
      select: { name: true, company: true, image: true, address: true },
    });
  },
  ["getSearchUsers"],
  { revalidate: 60 * 60 * 24, tags: ["users"] },
);
