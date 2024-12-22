import SheetLayoutProvider from "@/providers/sheet-layout-provider";

function UserSheetLayout({ children }: { children: React.ReactNode }) {
  return (
    <SheetLayoutProvider title="Modal page utilisateur" description="Modifier ou créer un utilisateur">
      {children}
    </SheetLayoutProvider>
  );
}

export default UserSheetLayout;
