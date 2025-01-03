"use client";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function ModalLayoutProvider({
  children,
  title,
  description,
  className,
}: { children: React.ReactNode; title: string; description?: string; className?: string }) {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      modal
      className={cn("overflow-y-scroll w-[90%] max-h-[90%] sm:max-w-md md:max-w-lg ", className)}
      headerClassName="sr-only"
      title={title}
      description={description}
      onOpenAutoFocus={(e) => e.preventDefault()}
    >
      {children}
    </Modal>
  );
}

export default ModalLayoutProvider;
