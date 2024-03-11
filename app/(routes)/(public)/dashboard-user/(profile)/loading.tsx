import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersColumn } from "./components/order-column";
import { UserButtons } from "./components/user-buttons";
import Container from "@/components/ui/container";

const Loading = () => {
  return (
    <Container className="mb-4 mt-4 gap-4">
      <>
        <div className="mx-auto mb-4 flex h-fit w-fit flex-col items-center justify-center gap-2 rounded-md border-2 p-6 text-gray-800 shadow-xl dark:text-white">
          <>
            <div className="flex flex-col gap-1 text-center text-3xl font-bold">
              <Skeleton className="h-6 w-40 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24 rounded-full" />
          </>

          <UserButtons />
        </div>
        <div className="text-md flex flex-col items-center justify-center text-gray-800 dark:text-white sm:text-xl">
          <div className="grid grid-cols-2 items-center gap-4">
            <p className="font-bold ">Email:</p>
            <Skeleton className="h-4 w-24 rounded-full" />
            <p className="font-bold">Adresse:</p>
            <Skeleton className="h-4 w-24 rounded-full" />
            <p className="font-bold">Télephone:</p>
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        </div>

        <div className="p-4">
          <>
            <Heading title={`Commandes`} description="Résumé des commandes" />
            <Separator />
            <DataTableSkeleton columns={OrdersColumn} />
          </>
        </div>
      </>
    </Container>
  );
};

export default Loading;
