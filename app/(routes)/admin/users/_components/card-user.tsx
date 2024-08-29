import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { Package, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";

interface CardUserProps {
  user: User;
  orderLength: number;
  isPaid: boolean;
  display: boolean;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({ user, className, isPaid, display, orderLength }) => {
  const name = user.company || user.name || user.email || "";

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
            {user.completed ? <p className="text-green-500">Complet</p> : <p className="text-red-500">Incomplet</p>}
            <p className="flex gap-2 items-center justify-center">
              {" "}
              {orderLength} <Package className="h-4 w-4" />
              {display && (isPaid ? <FaCheck className="text-green-500" /> : <X className="text-destructive" />)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-end justify-between  gap-1">
          <Button asChild className="text-xs sm:text-sm w-full">
            <Link href={`/admin/users/${user.id}`}>Consulter</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardUser;
