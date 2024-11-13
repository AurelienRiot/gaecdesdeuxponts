"use client";

import FormLoadingButton from "@/components/form-loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { z } from "zod";
import addNewStock from "../_actions/add-new-stock";
import type { schema } from "./schema";

function NewStockModal() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { serverAction, zodErrors } = useServerAction(addNewStock);
  async function onSumbit(formdata: FormData) {
    serverAction({
      data: Object.fromEntries(formdata.entries()) as unknown as z.infer<typeof schema>,
      onSuccess: () => {
        router.refresh();
        formRef.current?.reset();
        setOpen(false);
      },
    });
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2  h-4 w-4" /> Ajouter un stock
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Ajouter un stock" description="Ajouter un stock">
        <form ref={formRef} action={onSumbit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor={"name"}>Nom</Label>
            <Input type="text" name="name" />
            {zodErrors?.name && <p className="text-destructive">{zodErrors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor={"totalQuantity"}>Stock</Label>
            <Input type={"number"} name={"totalQuantity"} placeholder="quantité" className="w-3/5" />
            {zodErrors?.totalQuantity && <p className="text-destructive">{zodErrors.totalQuantity}</p>}
          </div>
          <FormLoadingButton>Créer</FormLoadingButton>
        </form>
      </Modal>
    </>
  );
}

export default NewStockModal;
