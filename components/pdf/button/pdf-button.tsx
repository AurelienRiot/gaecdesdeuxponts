import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PdfButton({
  onViewFile,
  onSaveFile,
  onSendFile,
  disabled,
  isSend,
  onSendClassName,
  onViewClassName,
  onSaveClassName,
}: {
  onViewFile: () => void;
  onSaveFile: () => void;
  onSendFile: (setSend: (send: boolean) => void) => void;
  disabled?: boolean;
  isSend: boolean;
  onSendClassName?: string;
  onViewClassName?: string;
  onSaveClassName?: string;
}) {
  const [send, setSend] = useState(isSend);
  return (
    <div className="flex flex-wrap gap-1">
      <Button
        onClick={onViewFile}
        type="button"
        disabled={disabled}
        className={cn("hidden sm:inline-flex", onViewClassName)}
      >
        {disabled && <Spinner className="h-5 w-5 mr-2" />}
        {"Afficher"}
      </Button>
      <Button
        onClick={onSaveFile}
        type="button"
        disabled={disabled}
        className={cn("hidden sm:inline-flex", onSaveClassName)}
      >
        {disabled && <Spinner className="h-5 w-5 mr-2" />}

        {"Télecharger"}
      </Button>
      <Button onClick={() => onSendFile(setSend)} type="button" disabled={disabled} className={onSendClassName}>
        {disabled && <Spinner className="h-5 w-5 mr-2" />}

        {send ? "Renvoyer par mail" : "Envoyer par mail"}
      </Button>
    </div>
  );
}
