import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenAutoFocus?: (e: Event) => void;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  modal?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onOpenAutoFocus,
  children,
  className,
  headerClassName,
  modal = true,
}) => {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onChange} modal={modal}>
      <DialogContent onOpenAutoFocus={(e) => onOpenAutoFocus?.(e)} className={className}>
        <DialogHeader className={headerClassName}>
          <DialogTitle> {title} </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
