"use client";

import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

function ModalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      modal
      className="overflow-y-scroll w-[90%] max-h-[90%] sm:max-w-[90%] md:max-w-[90%] "
      title=""
    >
      {children}
    </Modal>
  );
}

export default ModalLayout;
