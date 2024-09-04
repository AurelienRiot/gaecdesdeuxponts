"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import changeEmail from "../_actions/change-email";

function MailForm({ email, id }: { email: string | null; id: string }) {
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSumbit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const newEmail = new FormData(e.target as HTMLFormElement).get("email");
    await changeEmail({ email: newEmail as string, id })
      .then((result) => {
        if (!result.success) {
          toast.error(result.message, { position: "top-center" });
          return;
        }
        toast.success("Email modifie avec succes", { position: "top-center" });
        router.refresh();
        setDisplay(false);
      })
      .catch((error) => {
        toast.error("Une erreur est survenue", { position: "top-center" });
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <div className="py-4 space-y-4">
      <p className="font-bold">{email}</p>
      <Button
        className={email?.includes("acompleter") ? "font-bold text-destructive" : ""}
        onClick={() => setDisplay(!display)}
      >
        Changer l'email
      </Button>
      {display && (
        <form className="flex gap-4" onSubmit={onSumbit}>
          <Input disabled={loading} name="email" className="max-w-xs" placeholder="Entrez la nouvelle adresse email" />
          <LoadingButton type="submit" disabled={loading}>
            Valider
          </LoadingButton>
        </form>
      )}
    </div>
  );
}

export default MailForm;
