"use client";
import Invoice from "@/components/pdf/create-invoice";
import { Button } from "@/components/ui/button";
import { UserWithOrdersAndAdress } from "@/types";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Download, ExternalLink } from "lucide-react";
import MonthlyInvoice from "./create-monthly-invoice";
import ShippingOrder from "./create-shipping";
import { DataInvoiceType } from "./data-invoice";
import { createMonthlyDataInvoice } from "./data-monthly-invoice";
import { DataShippingOrderType } from "./data-shipping";
import { toast } from "sonner";

export const DisplayInvoice = ({
  data,
  isPaid,
}: {
  data: DataInvoiceType;
  isPaid: boolean;
}) => {
  const saveFile = () => {
    pdf(<Invoice isPaid={isPaid} dataInvoice={data} />)
      .toBlob()
      .then((blob) => saveAs(blob, `Facture-${data.order.id}.pdf`));
  };

  const viewFile = () => {
    pdf(<Invoice isPaid={isPaid} dataInvoice={data} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      });
  };
  return <PdfButton viewFile={viewFile} saveFile={saveFile} />;
};

export const DisplayMonthlyInvoice = ({
  user,
  month,
  year,
}: {
  user: UserWithOrdersAndAdress;
  month: number;
  year: number;
}) => {
  const saveFile = () => {
    const { data, isPaid } = createMonthlyDataInvoice({ user, month, year });
    if (data.order.length === 0) {
      toast.error("Aucune commande pour ce mois");
      return;
    }
    pdf(<MonthlyInvoice data={data} isPaid={isPaid} />)
      .toBlob()
      .then((blob) => saveAs(blob, `Facture-mensuelle.pdf`));
  };

  const viewFile = () => {
    const { data, isPaid } = createMonthlyDataInvoice({ user, month, year });
    if (data.order.length === 0) {
      toast.error("Aucune commande pour ce mois");
      return;
    }
    pdf(<MonthlyInvoice data={data} isPaid={isPaid} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      });
  };
  return <PdfButton viewFile={viewFile} saveFile={saveFile} />;
};

export const DisplayShippingOrder = ({
  data,
}: {
  data: DataShippingOrderType;
}) => {
  const saveFile = () => {
    pdf(<ShippingOrder dataOrder={data} />)
      .toBlob()
      .then((blob) => saveAs(blob, `Bon_de_livraison-${data.order.id}.pdf`));
  };

  const viewFile = () => {
    pdf(<ShippingOrder dataOrder={data} />)
      .toBlob()
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      });
  };
  return <PdfButton viewFile={viewFile} saveFile={saveFile} />;
};

function PdfButton({
  viewFile,
  saveFile,
}: {
  viewFile: () => void;
  saveFile: () => void;
}) {
  return (
    <div className="flex flex-row gap-1">
      <Button
        variant={"expandIcon"}
        Icon={ExternalLink}
        iconPlacement="right"
        onClick={viewFile}
        type="button"
      >
        {"Afficher"}
      </Button>
      <Button
        variant={"expandIcon"}
        Icon={Download}
        iconPlacement="right"
        onClick={saveFile}
        type="button"
      >
        {"Télecharger"}
      </Button>
    </div>
  );
}
