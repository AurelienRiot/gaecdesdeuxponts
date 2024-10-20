"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { type ButtonProps, LoadingButton } from "./ui/button";

const FormLoadingButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, children, ...props }, ref) => {
    const { pending } = useFormStatus();
    return (
      <LoadingButton type="submit" disabled={disabled || pending} ref={ref} {...props}>
        {children}
      </LoadingButton>
    );
  },
);

FormLoadingButton.displayName = "FormLoadingButton";

export default FormLoadingButton;
