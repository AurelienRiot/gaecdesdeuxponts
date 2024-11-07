import { CreateUserForm } from "@/app/(routes)/admin/users/[userId]/_components/create-user-form";
import { UserForm } from "@/app/(routes)/admin/users/[userId]/_components/user-form";
import prismadb from "@/lib/prismadb";
import UserSheet from "./components/user-sheet";

export const dynamic = "force-dynamic";

async function IntercepteUserPage({
  params,
}: {
  params: { userId: string | "new" | undefined };
}) {
  return (
    <UserSheet>
      <DisplayUserForm userId={params.userId} />
    </UserSheet>
  );
}

export default IntercepteUserPage;

async function DisplayUserForm({ userId }: { userId: string | "new" | undefined }) {
  if (userId === "new") {
    return <CreateUserForm />;
  }

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      address: true,
      billingAddress: true,
      links: true,
    },
  });

  if (!user) {
    return (
      <>
        <div>Utilisateur introuvable </div>
      </>
    );
  }

  return <UserForm initialData={user} incomplete={true} />;
}
