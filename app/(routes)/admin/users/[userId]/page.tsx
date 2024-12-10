import ButtonBackward from "@/components/ui/button-backward";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ShopButton from "./_components/shop-button";
import { CreateUserForm } from "./_components/create-user-form";
import { OrderTable } from "./_components/order-table";
import { UserForm } from "./_components/user-form";
import getUnlinkShop from "./_functions/get-unllink-shop";
import getUserPageData from "./_functions/get-user-page-data";

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
      <ShopButton user={user.formatedUser} shops={shops} />
      <div>
        <OrderTable data={user.formattedOrders} />
      </div>
    </div>
  );
};

export default UserPage;
