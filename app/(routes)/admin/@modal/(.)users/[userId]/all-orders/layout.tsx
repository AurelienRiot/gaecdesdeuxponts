import SheetLayoutProvider from "@/providers/sheet-layout-provider";

function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SheetLayoutProvider side="bottom" title="Modal toutes les commandes" description="Toutes les commandes du client">
      {children}
    </SheetLayoutProvider>
  );
}

export default ModalLayout;
