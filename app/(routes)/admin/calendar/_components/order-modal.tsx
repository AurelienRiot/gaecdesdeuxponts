import { Modal } from "@/components/ui/modal";
import { dateFormatter } from "@/lib/date-utils";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

function OrderModal({ isOpen, onClose, date }: OrderModalProps) {
  return (
    <Modal
      title={`Commande pour le ${dateFormatter(date, { days: true })}`}
      description=""
      isOpen={isOpen}
      onClose={onClose}
      className="left-[50%] top-[50%] max-h-[90%] w-[90%] max-w-[700px] overflow-y-scroll hide-scrollbar"
    >
      test {date.toISOString()}
    </Modal>
  );
}

export default OrderModal;
