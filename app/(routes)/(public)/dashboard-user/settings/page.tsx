"use client";
import { SkeletonAdressForm } from "@/components/skeleton-ui/address-skeleton";
import { Skeleton } from "@/components/skeleton-ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";
import { Trash } from "lucide-react";
import { UserForm } from "./_components/user-form";
import { TrashButton } from "@/components/animations/lottie-animation/lottie-animation";

const PageSettings = () => {
  const { user } = useUserContext();

  if (!user) {
    return <LoadingUserForm />;
  }

  const formattedUser = {
    name: user.name || "",
    role: user.role || "",
    phone: user.phone || "",
    email: user.email || "",
    company: user.company || "",
    adress: {
      label: user.address[0]?.label || "",
      city: user.address[0]?.city || "",
      country: user.address[0]?.country || "FR",
      line1: user.address[0]?.line1 || "",
      line2: user.address[0]?.line2 || "",
      postalCode: user.address[0]?.postalCode || "",
      state: user.address[0]?.state || "",
    },
  };
  return (
    <div className="h-full w-full flex-col p-6  ">
      <div className=" flex-1 space-y-4 ">
        <UserForm initialData={formattedUser} />
      </div>
    </div>
  );
};

export default PageSettings;

const LoadingUserForm = () => (
  <div className="h-full w-full flex-col p-6  ">
    <div className=" flex-1 space-y-4 ">
      <div className=" flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-3xl font-bold ">
          {" "}
          <Skeleton className="h-4 w-32" />{" "}
        </h2>
        <TrashButton
          disabled={true}
          variant="destructive"
          size="sm"
          className="ml-3"
          iconClassName="ml-2 size-6"
        >
          Supprimer le compte
        </TrashButton>
      </div>
      <Separator className="mt-4" />
      <p className=" py-6  text-base font-bold sm:text-lg">
        <Skeleton className="h-4 w-32" />
      </p>

      <div className="w-full space-y-8 pb-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-2">
            <Label>Numéro de téléphone</Label>
            <Skeleton className="h-4 w-32" />
          </div>

          <SkeletonAdressForm className="max-w-lg sm:col-span-2" />
        </div>
        <Button disabled={true} className="ml-auto " type="submit">
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  </div>
);
