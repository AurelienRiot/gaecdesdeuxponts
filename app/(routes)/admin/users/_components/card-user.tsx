"use client";
import { AlertModal } from "@/components/ui/alert-modal-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@/components/ui/checkbox";
import useServerAction from "@/hooks/use-server-action";
import deleteUser from "../_actions/delete-user";
import updateProStatus from "../_actions/update-pro-status";

interface CardUserProps {
  user: User;
  orderLength: number;
  className?: string;
}

const CardUser: React.FC<CardUserProps> = ({ user, orderLength, className }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState<CheckedState>(user.role === "pro");
  const { serverAction: deleteUserAction, loading: deleteUserLoading } = useServerAction(deleteUser);
  const { serverAction: updateProUserAction, loading: updateProUserLoading } = useServerAction(updateProStatus);

  const onDelete = async () => {
    await deleteUserAction({
      data: { email: user.email },
      onSuccess: () => router.refresh(),
      onFinally: () => setOpen(false),
    });
  };

  const onChange = async (e: CheckedState) => {
    setCheck("indeterminate");
    await updateProUserAction({
      data: { id: user.id, check: e },
      onSuccess: () => setCheck(e),
      onError: () => setCheck(!e),
    });
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} />

      <Card className={cn("flex h-full w-full min-w-[300px] flex-col justify-between", className)}>
        <CardHeader>
          <CardTitle
            onClick={() => {
              router.refresh();
            }}
          >
            <Link href={`/admin/users/${user.id}`} className="capitalize hover:underline">
              <span>{user.name ? user.name : "Non renseigné"}</span>
              <span>{user.company ? ` - ${user.company}` : ""}</span>
            </Link>
          </CardTitle>
          <CardDescription>
            <Link href={`/admin/users/${user.id}`} className="hover:underline">
              {user.email}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="p-2">{`Nombre de commandes : ${orderLength}`}</p>
          <div className="flex flex-row items-center justify-center gap-2">
            <p>{check === true ? "Professionnel " : "Particulier"}</p>
            <Checkbox checked={check} onCheckedChange={onChange} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-end justify-between  gap-2">
          <Button
            disabled={updateProUserLoading || deleteUserLoading}
            variant="outline"
            onClick={() => setOpen(true)}
            className="hover:underline"
          >
            Supprimer
          </Button>
          <Button asChild disabled={updateProUserLoading || deleteUserLoading} className="hover:underline">
            <Link href={`/admin/users/${user.id}`}>Modifier</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardUser;
