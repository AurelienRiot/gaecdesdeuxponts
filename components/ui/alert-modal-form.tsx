"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import Spinner from "../animations/spinner";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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
      <div className="flex items-center justify-end w-full pt-6 space-x-2">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          {"Annuler"}
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {!loading ? "Continuer" : <Spinner size={20} />}
        </Button>
      </div>
    </Modal>
  );
};
