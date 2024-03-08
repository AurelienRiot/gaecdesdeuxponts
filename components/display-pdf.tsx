import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DisplayPdf = ({
  avalaible,
  pdfUrl,
}: {
  avalaible: boolean;
  pdfUrl: string;
}) => {
  return (
    <span className="flex flex-row gap-1">
      {" "}
      {avalaible ? (
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
