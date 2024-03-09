import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import prismadb from "@/lib/prismadb";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserClient from "./components/client";

const UserPage = async () => {
  return (
    <Suspense fallback={<SeverUserClientLoading />}>
      <SeverUserClient />
    </Suspense>
  );
};

export default UserPage;

const SeverUserClient = async () => {
  const allUsers = await prismadb.user.findMany({
    where: {
      role: "user",
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      orders: true,
    },
  });

  const orderLengths = allUsers.map((user) => {
    return user.orders.length;
  });

  const formatedUsers = allUsers.map((user) => {
    return {
      ...user,
      orders: [],
    };
  });

  return <UserClient users={formatedUsers} orderLengths={orderLengths} />;
};

const SeverUserClientLoading = () => {
  return (
    <div className="m-4">
      <Heading title={`Clients `} description="Liste des clients" />
      <div className="justify-content-center mt-4 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Input placeholder="Recherche" disabled={true} />

        <div
          className={
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          <p>nom</p>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>
      <div className="grid grid-cols-1 space-y-4 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="m-4">
            <Card>
              <CardHeader>
                <CardTitle
                  className="justify-left flex
                 cursor-pointer items-center gap-3 hover:underline"
                >
                  <Skeleton className="h-4 w-20 rounded-full " />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </CardTitle>
                <CardDescription className="justify-left flex items-center">
                  <Skeleton as="span" className="h-4 w-24 rounded-full" />
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="flex justify-center p-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
                <div className="flex items-center justify-center p-2">
                  {`Nombre de commandes : `}{" "}
                  <Skeleton className="ml-2 h-4 w-5 rounded-full" />
                </div>
                <div className="flex items-center justify-center p-2">
                  {`Nombre d'abonnements : `}
                  <Skeleton
                    className="ml-2 h-4 w-5
                  rounded-full"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col justify-between gap-y-3 lg:flex-row lg:gap-x-2">
                <Button variant="destructive" className="hover:underline">
                  Supprimer
                </Button>
                <Button className="hover:underline">
                  <Link href={`#`}>Modifier</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
