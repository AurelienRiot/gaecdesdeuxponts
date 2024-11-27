import { getUserName } from "@/components/table-custom-fuction";
import prismadb from "@/lib/prismadb";
import { addressFormatter } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export const getSearchUsers = unstable_cache(
  async () => {
    const user = await prismadb.user.findMany({
      where: { role: { notIn: ["readOnlyAdmin", "admin", "deleted", "user"] }, shop: null },
      orderBy: {
        updatedAt: "desc",
      },
      select: { id: true, name: true, company: true, image: true, address: true, email: true },
    });
    return user.map((user) => ({
      id: user.id,
      name: getUserName(user),
      image: user.image,
      address: addressFormatter(user.address, false),
      latitude: user.address?.latitude,
      longitude: user.address?.longitude,
    }));
  },
  ["getSearchUsers"],
  { revalidate: 60 * 60 * 24, tags: ["users", "shops"] },
);
