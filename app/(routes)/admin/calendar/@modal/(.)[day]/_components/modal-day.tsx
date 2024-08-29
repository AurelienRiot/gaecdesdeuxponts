"use client";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dateFormatter } from "@/lib/date-utils";
import { useRouter } from "next/navigation";

function ModalDay({ date, children }: { date?: Date; children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={() => {
        router.back();
      }}
      modal={true}
    >
      <DialogContent className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[700px] overflow-y-scroll  rounded-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-2xl lining-nums">
            Commande pour le
            {date ? (
              dateFormatter(date, { customFormat: "EEEE d MMMM" })
            ) : (
              <Skeleton className="inline ml-4 " variant={"default"} size={"lg"} />
            )}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default ModalDay;
