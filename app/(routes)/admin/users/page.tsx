import prismadb from "@/lib/prismadb";
import UserClient from "./_components/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import GroupedInvoicePage from "./_components/grouped-invoice";
import { getAllUsers } from "@/actions/get-user";

export const dynamic = "force-dynamic";

const UserPage = async () => {
  const allUsers = await getAllUsers();

  const orderLengths: { length: number; id: string }[] = allUsers.map((user) => {
    return { length: user.orders.length, id: user.id };
  });

  const userOrders = allUsers.map((user) => ({
    id: user.id,
    name: user.company || user.name || "",
    role: user.role,
    image: user.image || "",
    orders: user.orders.filter(
      (order) =>
        order.dateOfShipping &&
        order.dateOfShipping.getTime() <=
          new Date(new Date().setFullYear(new Date().getFullYear(), new Date().getMonth(), 1)).setHours(0, 0, 0, 0),
    ),
  }));

  const isPaidArray: { isPaid: boolean; id: string; display: boolean }[] = userOrders.map((user) => {
    const isPaid = user.orders.every((order) => order.dateOfPayment);
    return { isPaid, id: user.id, display: user.role === "pro" && user.orders.length > 0 };
  });

  const proUserWithOrders = userOrders
    .map((user) => ({
      ...user,
      orders: user.orders.filter((order) => !order.dateOfPayment),
    }))
    .filter((user) => user.role === "pro" && user.orders.length > 0);

  return (
    <div className="m-4 space">
      <div className="flex flex-col items-center justify-between sm:flex-row gap-y-2">
        <Heading title={`Clients (${allUsers.length})`} description="Liste des clients" />
        <GroupedInvoicePage proUserWithOrders={proUserWithOrders} />
        <Button asChild>
          <Link href={`/admin/users/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Créer un client
          </Link>
        </Button>
      </div>
      <UserClient users={allUsers} orderLengths={orderLengths} isPaidArray={isPaidArray} />
    </div>
  );
};

export default UserPage;
