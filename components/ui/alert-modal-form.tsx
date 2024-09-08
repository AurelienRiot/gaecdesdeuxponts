"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import useIsComponentMounted from "@/hooks/use-mounted";
import { useState } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const isMounted = useIsComponentMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Est-vous Sûr  ?"
      description="Cette action ne peut pas être annulée."
      isOpen={isOpen}
      onClose={onClose}
      className="left-[50%] top-[30%]"
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          {"Annuler"}
        </Button>
        <LoadingButton
          disabled={loading}
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
