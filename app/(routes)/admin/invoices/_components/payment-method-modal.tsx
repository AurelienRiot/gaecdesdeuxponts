"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import validateInvoice from "../_actions/validate-invoice";
import { createContext, useContext, useState } from "react";
import type { PaymentMethod } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useServerAction from "@/hooks/use-server-action";
import { useRouter } from "next/navigation";

type InvoiceModalContextType = {
  invoiceId: string | null;
  setInvoiceId: React.Dispatch<React.SetStateAction<string | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InvoiceModalContext = createContext<InvoiceModalContextType | undefined>(undefined);

export const InvoiceModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <InvoiceModalContext.Provider value={{ invoiceId, setInvoiceId, isOpen, setIsOpen }}>
      {children}
      <InvoiceModal />
    </InvoiceModalContext.Provider>
  );
};

export function useInvoiceModal() {
  const context = useContext(InvoiceModalContext);

  if (context === undefined) {
    throw new Error("useInvoiceModal must be used within a InvoiceModalProvider");
  }

  return context;
}

function InvoiceModal() {
  const { invoiceId, isOpen, setIsOpen } = useInvoiceModal();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const { serverAction, loading } = useServerAction(validateInvoice);
  const router = useRouter();

  const onSubmit = async () => {
    if (!invoiceId || !paymentMethod) return;

    await serverAction({ data: { id: invoiceId, isPaid: true, paymentMethod }, onSuccess: () => router.refresh() });
    setIsOpen(false);
  };

  return (
    <Modal title="Valider le paiement" className="p-4" isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Méthode de paiement</p>
          <Select onValueChange={(value: PaymentMethod) => setPaymentMethod(value)} value={paymentMethod ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une méthode" />
            </SelectTrigger>
            <SelectContent className="z-[1300]">
              <SelectItem value="CARD">Carte bancaire</SelectItem>
              <SelectItem value="CASH">Espèces</SelectItem>
              <SelectItem value="CHECK">Chèque</SelectItem>
              <SelectItem value="TRANSFER">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="default" className="w-full" disabled={!paymentMethod || loading} onClick={onSubmit}>
            Valider
          </Button>
        </div>
      </div>
    </Modal>
  );
}
