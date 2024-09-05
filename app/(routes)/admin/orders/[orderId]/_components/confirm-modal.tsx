import { Button, LoadingButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import useIsComponentMounted from "@/hooks/use-mounted";
import { useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const isMounted = useIsComponentMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Confirmer la commande"
      description="Confirmer la commande avant de la sauvegarder"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          {"Annuler"}
        </Button>
        <LoadingButton
          disabled={loading}
          type="button"
          variant="destructive"
          onClick={async (e) => {
            e.preventDefault();
            setLoading(true);
            await onConfirm();
            setLoading(false);
          }}
        >
          {"Confirmer"}
        </LoadingButton>
      </div>
    </Modal>
  );
};
