"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

function UserSheet({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        router.back();
        router.refresh();
      }}
      modal
    >
      <SheetContent
        aria-describedby={`Page utilisateur`}
        className="overflow-y-scroll w-[90%] sm:max-w-sm md:max-w-md "
      >
        {" "}
        <div className="space-y-6 w-full">
          <SheetHeader className="sr-only">
            <SheetTitle>
              <span>Page utilisateur</span>
            </SheetTitle>
            <SheetDescription className="">Modifier l'utilisateur'</SheetDescription>
          </SheetHeader>
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UserSheet;
