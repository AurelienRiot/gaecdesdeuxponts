import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CardHeaderUser from "./card-header-user";

interface CardUserProps {
  user: User;
  orderLength: number;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({ user, orderLength, className }) => {
  const name = user.company || user.name || user.email;
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
          <div className="flex flex-row items-center justify-center gap-1 font-bold rounded-md">
            {user.role === "pro" ? (
              <p className="text-green-500">Professionnel</p>
            ) : (
              <p className="text-blue-500">Particulier</p>
            )}
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
