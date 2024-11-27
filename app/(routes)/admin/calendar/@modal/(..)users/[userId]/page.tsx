import { CreateUserForm } from "@/app/(routes)/admin/users/[userId]/_components/create-user-form";
import ShopButton from "@/app/(routes)/admin/users/[userId]/_components/shop-button";
import { UserForm } from "@/app/(routes)/admin/users/[userId]/_components/user-form";
import getUnlinkShop from "@/app/(routes)/admin/users/[userId]/_functions/get-unllink-shop";
import getUserPageData from "@/app/(routes)/admin/users/[userId]/_functions/get-user-page-data";
import { Button } from "@/components/ui/button";
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function IntercepteUserPage({
  params,
}: {
  params: { userId: string | "new" | undefined };
}) {
  return (
    <div className="space-y-6 w-full">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>Page utilisateur</span>
        </SheetTitle>
        <SheetDescription className="">
          {params.userId === "new" ? "Créer un nouvel utilisateur" : "Modifier l'utilisateur"}
        </SheetDescription>
      </SheetHeader>
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
  // const user = await prismadb.user.findUnique({
  //   where: {
  //     id: userId,
  //   },
  //   include: {
  //     address: true,
  //     billingAddress: true,
  //     shop: { include: { links: true } },
  //   },
  // });

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
      <SheetFooter className="flex-col sm:flex-col  justify-center sm:gap-2 px-4">
        <Button asChild>
          <Link replace href={`/admin/users/${user.formatedUser.id}/default-orders`}>
            Commandes par default par jour
          </Link>
        </Button>
        <ShopButton user={user.formatedUser} shops={shops} />
      </SheetFooter>
    </>
  );
}
