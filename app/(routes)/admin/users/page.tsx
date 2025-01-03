import { getUserName } from "@/components/table-custom-fuction";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { UserStatus } from "./_components/card-user";
import UserClient from "./_components/client";
import getAllUsers from "./_functions/get-all-users";

export const dynamic = "force-dynamic";

const UserPage = async () => {
  const allUsers = await getAllUsers();

  const userOrders = allUsers.map((user) => ({
    id: user.id,
    name: getUserName(user),
    role: user.role,
    image: user.image || "",
    orders: user.orders.filter(
      (order) =>
        order.dateOfShipping &&
        new Date(order.dateOfShipping).getTime() <=
          new Date(new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), 1)).setHours(0, 0, 0, 0),
    ),
  }));

  const orderLengths: { length: number; id: string }[] = allUsers.map((user) => {
    return { length: user.orders.length, id: user.id };
  });
  const statusArray: { status: UserStatus; id: string; display: boolean }[] = userOrders.map((user) => {
    const invoiceNotSend = user.orders.every(
      (order) => !order.invoiceOrder[0]?.invoice.invoiceEmail || order.invoiceOrder[0]?.invoice.dateOfPayment,
    );
    const dateOfPayment = user.orders.every((order) => order.invoiceOrder[0]?.invoice.dateOfPayment);
    const status = dateOfPayment ? "paid" : invoiceNotSend ? "not send" : "unpaid";
    return { status, id: user.id, display: user.role === "pro" && user.orders.length > 0 };
  });

  return (
    <div className="m-4">
      <div className="flex flex-col items-center justify-between sm:flex-row gap-y-2">
        <Heading title={`Clients (${allUsers.length})`} description="Liste des clients" />
        <Button asChild>
          <Link href={`/admin/users/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un client
          </Link>
        </Button>
      </div>
      <UserClient users={allUsers} orderLengths={orderLengths} statusArray={statusArray} />
    </div>
  );
};

export default UserPage;
