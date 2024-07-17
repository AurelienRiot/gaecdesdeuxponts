import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import { ListOrdered } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CardUserProps {
  user: User;
  orderLength: number;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({ user, orderLength, className }) => {
  return (
    <>
      <Card className={cn("flex h-full w-[150px] sm:w-[200px] flex-col justify-between", className)}>
        <CardHeader className="p-4">
          <CardTitle className="overflow-hidden  font-semibold">
            <Link
              href={`/admin/users/${user.id}`}
              className="capitalize hover:underline sm:text-sm md:text-base text-xs whitespace-nowrap"
            >
              {user.company ? user.company : user.name ? user.name : user.email}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center p-2">
          <div className="gap-4 flex justify-center items-center">
            {user.image ? (
              <div className="size-6 relative rounded-md overflow-hidden">
                <Image src={user.image} alt="logo" fill className="object-contain" sizes="24px" />
              </div>
            ) : null}
            <p className="flex gap-2">
              <ListOrdered className="size-6" /> {orderLength}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
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
