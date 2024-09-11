"use client";

import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function PdfButton({
  onViewFile,
  onSaveFile,
  onSendFile,
  disabled,
  isSend,
}: {
  onViewFile: () => void;
  onSaveFile: () => void;
  onSendFile: (setSend: (send: boolean) => void) => void;
  disabled?: boolean;
  isSend: boolean;
}) {
  const [send, setSend] = useState(isSend);
  return (
    <div className="flex flex-wrap gap-1">
      <Button onClick={onViewFile} type="button" disabled={disabled} className="hidden sm:block">
        {disabled && <Spinner className="h-5 w-5" />}
        {"Afficher"}
      </Button>
      <Button onClick={onSaveFile} type="button" disabled={disabled} className="hidden sm:block">
        {disabled && <Spinner className="h-5 w-5" />}

        {"Télecharger"}
      </Button>
      <Button onClick={() => onSendFile(setSend)} type="button" disabled={disabled}>
        {disabled && <Spinner className="h-5 w-5 mr-2" />}

        {send ? "Renvoyer par mail" : "Envoyer par mail"}
      </Button>
    </div>
  );
}

export default PdfButton;
