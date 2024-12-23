import SheetLayoutProvider from "@/providers/sheet-layout-provider";

function ModalLayout({ children }: { children: React.ReactNode }) {
  return (
    <SheetLayoutProvider title="Modal page Magasin" description="Modifier ou créer un magasin">
      {children}
    </SheetLayoutProvider>
  );
}

export default ModalLayout;