"use client";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { UserFormValues } from "./user-schema";

function CcInvoiceForm() {
  const form = useFormContext<UserFormValues>();
  const ccInvoice = form.watch("ccInvoice");

  function removeEmailField(index: number) {
    const newCcInvoice = ccInvoice.filter((_, i) => i !== index);
    form.setValue("ccInvoice", newCcInvoice);
  }

  function addEmailField() {
    form.setValue("ccInvoice", [...ccInvoice, ""]);
  }

  return (
    <div className="space-y-2 w-56">
      <Label>Email pour cc facture</Label>
      {ccInvoice.map((email, index) => (
        <FormField
          key={index}
          control={form.control}
          name={`ccInvoice.${index}`}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>
          cc pour factures
        </FormLabel> */}
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Input
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="exemple@email.fr"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                    aria-label="Remove email field"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Button type="button" variant="outline" onClick={addEmailField} className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un email
      </Button>
    </div>
  );
}

export default CcInvoiceForm;
