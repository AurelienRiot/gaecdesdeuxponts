import { Suspense } from "react";
import UserSheet from "./components/user-sheet";
import Loading from "../../_loading";
import { CreateUserForm } from "@/app/(routes)/admin/users/[userId]/_components/create-user-form";
import prismadb from "@/lib/prismadb";
import ButtonBackward from "@/components/ui/button-backward";
import { UserForm } from "@/app/(routes)/admin/users/[userId]/_components/user-form";

export const dynamic = "force-dynamic";

async function IntercepteUserPage({
  params,
}: {
  params: { userId: string | "new" | undefined };
}) {
  return (
    <UserSheet>
      <Suspense fallback={<Loading />}>
        <DisplayUserForm userId={params.userId} />
      </Suspense>
    </UserSheet>
  );
}

export default IntercepteUserPage;

async function DisplayUserForm({ userId }: { userId: string | "new" | undefined }) {
  if (userId === "new") {
    return <CreateUserForm />;
  }

  const user = await await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      address: true,
      billingAddress: true,
    },
  });

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
      </>
    );
  }

  return <UserForm initialData={{ ...user, orders: [] }} incomplete={true} />;
}
