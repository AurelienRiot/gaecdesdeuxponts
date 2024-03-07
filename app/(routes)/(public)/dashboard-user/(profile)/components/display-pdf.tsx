import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DisplayPdf = ({ pdfUrl }: { pdfUrl: string | undefined }) => {
  return (
    <span className="flex flex-row gap-1">
      {" "}
      {pdfUrl ? (
        <>
          <Button asChild>
            <Link href={pdfUrl} target="_blank" className="hover:underline">
              Ouvrir
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={pdfUrl.replace(/mode=inline&/, "")}
              target="_blank"
              className="hover:underline"
            >
              Télécharger
            </Link>
          </Button>
        </>
      ) : (
        "Non disponible"
      )}
    </span>
  );
};
