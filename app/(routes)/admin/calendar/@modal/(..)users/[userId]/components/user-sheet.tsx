import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

function UserSheet({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 w-full">
      <SheetHeader className="sr-only">
        <SheetTitle>
          <span>Page utilisateur</span>
        </SheetTitle>
        <SheetDescription className="">Modifier l'utilisateur'</SheetDescription>
      </SheetHeader>
      {children}
    </div>
  );
}

export default UserSheet;
