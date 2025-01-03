import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmOptions {
  title?: string;
  description?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
  customActions?: (onConfirm: () => void, onCancel: () => void) => React.ReactNode;
  confirmButton?: React.ComponentPropsWithRef<typeof AlertDialogAction>;
  cancelButton?: React.ComponentPropsWithRef<typeof AlertDialogCancel> | null;
  alertDialogOverlay?: React.ComponentPropsWithRef<typeof AlertDialogOverlay>;
  alertDialogContent?: React.ComponentPropsWithRef<typeof AlertDialogContent>;
  alertDialogHeader?: React.ComponentPropsWithRef<typeof AlertDialogHeader>;
  alertDialogTitle?: React.ComponentPropsWithRef<typeof AlertDialogTitle>;
  alertDialogDescription?: React.ComponentPropsWithRef<typeof AlertDialogDescription>;
  alertDialogFooter?: React.ComponentPropsWithRef<typeof AlertDialogFooter>;
}

export interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

export const ConfirmContext = React.createContext<ConfirmContextType | undefined>(undefined);

const baseDefaultOptions: ConfirmOptions = {
  title: "",
  description: "",
  content: "",
  confirmText: "Confirmer",
  cancelText: "Annuler",
  confirmButton: {},
  cancelButton: {},
  alertDialogContent: {},
  alertDialogHeader: {},
  alertDialogTitle: {},
  alertDialogDescription: {},
  alertDialogFooter: {},
};

const ConfirmDialogContent: React.FC<{
  config: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}> = React.memo(({ config, onConfirm, onCancel }) => {
  const {
    title,
    description,
    content,
    cancelButton,
    confirmButton,
    confirmText,
    cancelText,
    icon,
    customActions,
    alertDialogOverlay,
    alertDialogContent,
    alertDialogHeader,
    alertDialogTitle,
    alertDialogDescription,
    alertDialogFooter,
  } = config;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay {...alertDialogOverlay} />
      <AlertDialogContent {...alertDialogContent}>
        <AlertDialogHeader {...alertDialogHeader}>
          {(title || icon) && (
            <AlertDialogTitle {...alertDialogTitle}>
              {icon}
              {title}
            </AlertDialogTitle>
          )}
          <AlertDialogDescription className={!description ? "sr-only" : ""} {...alertDialogDescription}>
            {description}
          </AlertDialogDescription>
          <div>{content}</div>
        </AlertDialogHeader>
        <AlertDialogFooter {...alertDialogFooter}>
          {customActions ? (
            customActions(onConfirm, onCancel)
          ) : (
            <>
              {cancelButton !== null && (
                <AlertDialogCancel onClick={onCancel} {...cancelButton}>
                  {cancelText}
                </AlertDialogCancel>
              )}
              <AlertDialogAction onClick={onConfirm} {...confirmButton}>
                {confirmText}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  );
});

ConfirmDialogContent.displayName = "ConfirmDialogContent";

const ConfirmDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: ConfirmOptions;
  onConfirm: () => void;
  onCancel: () => void;
}> = React.memo(({ isOpen, onOpenChange, config, onConfirm, onCancel }) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <ConfirmDialogContent config={config} onConfirm={onConfirm} onCancel={onCancel} />
  </AlertDialog>
));

ConfirmDialog.displayName = "ConfirmDialog";

export const ConfirmDialogProvider: React.FC<{
  defaultOptions?: ConfirmOptions;
  children: React.ReactNode;
}> = ({ defaultOptions = {}, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions>(baseDefaultOptions);
  const resolverRef = React.useRef<((value: boolean) => void) | null>(null);

  const mergedDefaultOptions = React.useMemo(
    () => ({
      ...baseDefaultOptions,
      ...defaultOptions,
    }),
    [defaultOptions],
  );

  const confirm = React.useCallback(
    (newOptions: ConfirmOptions) => {
      setOptions({ ...mergedDefaultOptions, ...newOptions });
      setIsOpen(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [mergedDefaultOptions],
  );

  const handleConfirm = React.useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(true);
  }, []);

  const handleCancel = React.useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) resolverRef.current(false);
  }, []);

  const contextValue = React.useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        config={options}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ((options: ConfirmOptions) => Promise<boolean>) => {
  const context = React.useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmDialogProvider");
  }
  return context.confirm;
};
