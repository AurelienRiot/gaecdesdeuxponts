"use client";

import { Modal } from "@/components/ui/modal";
import { useRouter } from "next/navigation";

function ModalLayoutProvider({
  children,
  title,
  description,
}: { children: React.ReactNode; title: string; description?: string }) {
  const router = useRouter();
  return (
    <Modal
      isOpen={true}
      onClose={() => router.back()}
      modal
      className="overflow-y-scroll w-[90%] max-h-[90%] sm:max-w-sm md:max-w-md "
      title={title}
      description={description}
    >
      {children}
    </Modal>
  );
}

export default ModalLayoutProvider;
