import { getUserName } from "@/components/table-custom-fuction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { CalendarClock, Check, Package, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DisplayRole from "./dispaly-role";

export type UserStatus = "paid" | "unpaid" | "not send";
interface CardUserProps {
  user: User;
  orderLength: number;
  status: UserStatus;
  display: boolean;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({ user, className, status, display, orderLength }) => {
  const name = getUserName(user);

  return (
    <>
      <Card className={cn("flex h-full relative w-[150px] sm:w-[200px] flex-col justify-between ", className)}>
        <CardHeader className=" w-full overflow-hidden">
          {user.image ? (
            <div className="lg:size-32 md:size-28 sm:size-24 size-20 relative mx-auto rounded-md overflow-hidden">
              <Image src={user.image} alt={`logo ${name}`} fill className="object-contain" sizes="200px" />
            </div>
          ) : (
            <CardTitle className="overflow-hidden text-center font-extrabold  rounded-md ">
              <Link
                href={`/admin/users/${user.id}`}
                className="capitalize hover:underline  sm:text-lg md:text-xl text-base whitespace-nowrap"
              >
                {user.company ? user.company : user.name ? user.name : user.email}
              </Link>
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="text-center p-2  rounded-md w-fit mx-auto         ">
          <div className="flex flex-col items-center justify-center gap-1 font-bold rounded-md">
            <DisplayRole user={user} />
            <p className="flex gap-2 items-center justify-center">
              {" "}
              {orderLength} <Package className="h-4 w-4" />
              {display &&
                (status === "paid" ? (
                  <Check className="text-green-500 size-4" />
                ) : status === "unpaid" ? (
                  <X className="text-destructive size-4" />
                ) : (
                  <CalendarClock className="text-yellow-500 size-4" />
                ))}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-end justify-between  gap-1">
          <Button asChild className="text-xs sm:text-sm w-full">
            <Link href={`/admin/users/${user.id}`}>Modifier</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardUser;
