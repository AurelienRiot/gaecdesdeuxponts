"use client";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser } from "./server-action";
import { toast } from "sonner";

interface CardUserProps {
  user: User;
  orderLength: number;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({
  user,
  orderLength,
  className,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    const deleteU = await deleteUser({ id: user.id });
    if (!deleteU.success) {
      toast.error(deleteU.message);
    } else {
      router.refresh();
      toast.success("Utilisateur supprimée");
    }
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />

      <Card
        className={cn(
          "flex h-full w-full min-w-[300px] flex-col justify-between",
          className,
        )}
      >
        <CardHeader>
          <CardTitle
            onClick={() => {
              router.push(`/admin/users/${user.id}`);
              router.refresh();
            }}
            className="cursor-pointer hover:underline"
          >
            <>
              <span className="capitalize">{user.name}</span>{" "}
            </>
          </CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="p-2">{`Nombre de commandes : ${orderLength}`}</p>
        </CardContent>
        <CardFooter className="flex flex-row items-end justify-between  gap-2">
          <Button
            variant="destructive"
            onClick={() => setOpen(true)}
            className="hover:underline"
          >
            Supprimer
          </Button>
          <Button className="hover:underline">
            <Link href={`/admin/users/${user.id}`}>Modifier</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardUser;
