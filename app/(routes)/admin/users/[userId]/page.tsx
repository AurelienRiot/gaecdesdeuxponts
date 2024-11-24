import ButtonBackward from "@/components/ui/button-backward";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreateUserForm } from "./_components/create-user-form";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";
import getUserPageData, { type GetUserPageDataProps } from "./_functions/get-user-page-data";
import getUnlinkShop from "./_functions/get-unllink-shop";
import LinkShop from "./_components/link-shop";
import type { Shop } from "@prisma/client";

export const dynamic = "force-dynamic";

const UserPage = async ({
  params,
  searchParams,
}: {
  params: { userId: string | "new" | undefined };
  searchParams: { incomplete: string | undefined };
}) => {
  if (params.userId === "new") {
    return <CreateUserForm />;
  }

  const [user, shops] = await Promise.all([getUserPageData(params.userId), getUnlinkShop()]);

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
        <ButtonBackward />
      </>
    );
  }

  const incomplete =
    !!searchParams.incomplete ||
    user.formatedUser.email?.includes("acompleter") ||
    !user.formatedUser.name ||
    user.formatedUser.name?.includes("acompleter");

  return (
    <div className="space-y-6 p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4">
        <UserForm initialData={user.formatedUser} incomplete={incomplete} />
      </div>
      <Button asChild>
        <Link href={`/admin/users/${user.formatedUser.id}/default-orders`}>Commandes par default par jour</Link>
      </Button>
      <DisplayShop user={user.formatedUser} shops={shops} />
      <div>
        <OrderTable data={user.formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;

function DisplayShop({ user, shops }: { user: GetUserPageDataProps["formatedUser"]; shops: Shop[] }) {
  const searchParams = new URLSearchParams();
  searchParams.set("userId", user.id);
  user.company && searchParams.set("name", user.company);
  user.image && searchParams.set("image", user.image);
  return user.shop ? (
    <Button asChild className="block w-fit">
      <Link href={`/admin/shops/${user.shop.id}`}>Modifier le magasin</Link>
    </Button>
  ) : (
    <div className="flex gap-4 flex-wrap items-center">
      <Button asChild variant="outline">
        <Link href={`/admin/shops/new?${searchParams.toString()}`}>Créer un magasin</Link>
      </Button>

      <LinkShop userId={user.id} shops={shops} />
    </div>
  );
}
