"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import useServerAction from "@/hooks/use-server-action";
import { sanitizeId } from "@/lib/id";
import { useRouter } from "next/navigation";
import { useState } from "react";
import changeShopId from "../_actions/change-id";

function IdForm({ id, name }: { id: string; name: string }) {
  const [display, setDisplay] = useState(false);

  return (
    <div className="py-4 space-y-4">
      <Button onClick={() => setDisplay(!display)}>Changer l'identifiant</Button>
      <IdModal id={id} name={name} openModal={display} onClose={() => setDisplay(false)} />
    </div>
  );
}

export default IdForm;

function IdModal({
  id,
  onClose,
  openModal,
  name,
}: { id: string; onClose: () => void; openModal: boolean; name: string }) {
  const { serverAction, loading } = useServerAction(changeShopId);
  const [newId, setNewId] = useState(id);
  const router = useRouter();

  function makeId() {
    setNewId(sanitizeId(name));
  }

  async function onSumbit() {
    serverAction({
      data: { newId, id },
      onSuccess: () => {
        onClose();
        router.replace(`/admin/shops/${newId}`, { scroll: false });
      },
    });
  }

  return (
    <Modal
      title="Changer l'identifiant"
      description="Entrez le nouvel identifiant ci-dessous"
      className="top-[30%]"
      isOpen={openModal}
      onClose={onClose}
    >
      <div className="space-y-4 relative">
        <Button className="absolute top-0 right-0" onClick={makeId}>
          Generer un identifiant
        </Button>
        <Input
          type="string"
          name="newId"
          id="newId"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
          placeholder="identifiant"
        />
        <DialogFooter>
          <LoadingButton disabled={loading} type="button" onClick={onSumbit}>
            Mettre à jour l'identifiant
          </LoadingButton>
        </DialogFooter>
      </div>
    </Modal>
  );
}
