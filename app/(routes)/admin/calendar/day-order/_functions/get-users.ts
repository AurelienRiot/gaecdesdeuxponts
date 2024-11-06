"server only";
import prismadb from "@/lib/prismadb";

async function getUsers() {
  return await prismadb.user.findMany({
    where: {
      role: { in: ["pro", "user", "trackOnlyUser"] },
    },
  });
}
export type GetUsersType = Awaited<ReturnType<typeof getUsers>>;
export default getUsers;
