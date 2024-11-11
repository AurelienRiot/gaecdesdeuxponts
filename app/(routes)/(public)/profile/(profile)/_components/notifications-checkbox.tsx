"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useServerAction from "@/hooks/use-server-action";
import { useUserQuery, useUserQueryClient } from "../../../../../../hooks/use-query/user-query";
import changeInvoice from "../_actions/change-invoice";
import changeShipping from "../_actions/change-shipping";

function NotificationsCheckbox() {
  const { data: user } = useUserQuery();
  const { mutateUser } = useUserQueryClient();
  const { serverAction: changeInvoiceAction, loading: invoiceLoading } = useServerAction(changeInvoice);
  const { serverAction: changeShippingAction, loading: shippingLoading } = useServerAction(changeShipping);

  async function onChangeShippingNotification() {
    if (!user) {
      return;
    }
    mutateUser((prev) => {
      if (prev) {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            sendShippingEmail: !prev.notifications.sendShippingEmail,
          },
        };
      }
      return prev;
    });
    function onError() {
      mutateUser((prev) => {
        if (prev) {
          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              sendShippingEmail: !prev.notifications.sendShippingEmail,
            },
          };
        }
        return prev;
      });
    }
    await changeShippingAction({
      data: {
        checked: !user?.notifications.sendShippingEmail,
      },
      onError,
    });
  }
  async function onChangeInvoiceNotification() {
    if (!user) {
      return;
    }
    mutateUser((prev) => {
      if (prev) {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            sendInvoiceEmail: !prev.notifications.sendInvoiceEmail,
          },
        };
      }
      return prev;
    });
    function onError() {
      mutateUser((prev) => {
        if (prev) {
          return {
            ...prev,
            notifications: {
              ...prev.notifications,
              sendInvoiceEmail: !prev.notifications.sendInvoiceEmail,
            },
          };
        }
        return prev;
      });
    }
    await changeInvoiceAction({
      data: {
        checked: !user?.notifications.sendInvoiceEmail,
      },
      onError,
    });
  }
  return (
    <div className="flex flex-wrap gap-4">
      <label
        htmlFor="shipping-notification"
        className="p-4 flex cursor-pointer flex-row items-start space-x-3 space-y-0 w-fit h-full rounded-md border"
      >
        <Checkbox
          id="shipping-notification"
          checked={user ? user.notifications.sendShippingEmail : true}
          onCheckedChange={onChangeShippingNotification}
          disabled={shippingLoading}
        />
        <div className="space-y-1 leading-none">
          <Label className="cursor-pointer">Bon de livraison</Label>
          <p className={"text-sm text-muted-foreground"}>Recevoir les bons de livraison par mail</p>
        </div>
      </label>
      <label
        htmlFor="invoice-notification"
        className="p-4 flex cursor-pointer flex-row items-start space-x-3 space-y-0 w-fit h-full rounded-md border"
      >
        <Checkbox
          id="invoice-notification"
          checked={user ? user.notifications.sendInvoiceEmail : true}
          onCheckedChange={onChangeInvoiceNotification}
          disabled={invoiceLoading}
        />
        <div className="space-y-1 leading-none">
          <Label className="cursor-pointer">Facture</Label>
          <p className={"text-sm text-muted-foreground"}>Recevoir les factures par mail</p>
        </div>
      </label>
    </div>
  );
}

export default NotificationsCheckbox;
