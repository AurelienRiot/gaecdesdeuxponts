import { CreateUserForm } from "@/app/(routes)/admin/users/[userId]/_components/create-user-form";
import ShopButton from "@/app/(routes)/admin/users/[userId]/_components/shop-button";
import { UserForm } from "@/app/(routes)/admin/users/[userId]/_components/user-form";
import getUnlinkShop from "@/app/(routes)/admin/users/[userId]/_functions/get-unllink-shop";
import getUserPageData from "@/app/(routes)/admin/users/[userId]/_functions/get-user-page-data";
import { Button } from "@/components/ui/button";
import { SheetFooter } from "@/components/ui/sheet";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function IntercepteUserPage(props: {
  params: Promise<{ userId: string | "new" | undefined }>;
}) {
  const params = await props.params;
  return (
    <div className="space-y-6 w-full">
      <DisplayUserForm userId={params.userId} />
    </div>
  );
}

export default IntercepteUserPage;

async function DisplayUserForm({ userId }: { userId: string | "new" | undefined }) {
  if (userId === "new") {
    return <CreateUserForm />;
  }

  const [user, shops] = await Promise.all([getUserPageData(userId), getUnlinkShop()]);

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
      </>
    );
  }

  return (
    <>
      <UserForm initialData={user.formatedUser} incomplete={true} />
      <SheetFooter className="flex-col sm:flex-col justify-center gap-4 px-4 ">
        <Button asChild>
          <Link replace href={`/admin/users/${user.formatedUser.id}/default-orders`}>
            Commandes par default par jour
          </Link>
        </Button>
        <ShopButton user={user.formatedUser} shops={shops} />
        <Button asChild>
          <Link href={`/admin/users/${user.formatedUser.id}/all-orders`}>Voir les Commandes</Link>
        </Button>
      </SheetFooter>
    </>
  );
}
