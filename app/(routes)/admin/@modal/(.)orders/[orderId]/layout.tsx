import SheetLayoutProvider from "@/providers/sheet-layout-provider";

function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SheetLayoutProvider title="Modal page commande" description="Modifier ou créer une commande">
      {children}
    </SheetLayoutProvider>
  );
}

export default ModalLayout;
