"use client";

import {
  ConfirmDialogProvider as BaseConfirmDialogProvider,
  type ConfirmOptions,
} from "@/components/ui/confirm-dialog";

interface Props {
  children: React.ReactNode;
  defaultOptions?: ConfirmOptions;
}

const ConfirmDialogProvider = ({ children, defaultOptions }: Props) => {
  return <BaseConfirmDialogProvider defaultOptions={defaultOptions}>{children}</BaseConfirmDialogProvider>;
};

export default ConfirmDialogProvider;
