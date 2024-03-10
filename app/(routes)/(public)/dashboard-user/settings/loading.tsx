import { SkeletonAdressForm } from "@/components/address-form";
import Spinner from "@/components/animations/spinner";
import { Button } from "@/components/ui/button";
import ButtonBackward from "@/components/ui/button-backward";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash } from "lucide-react";

const SettingsLoading = () => {
  return (
    <div className="flex-col p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4 ">
        <div>
          <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            <h2 className="text-3xl font-bold tracking-tight">
              Modifier le profil
            </h2>

            <Button
              disabled={true}
              variant="destructive"
              size="sm"
              className="ml-3"
            >
              Supprimer le compte <Trash className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Separator />
          <div>
            <Skeleton className="h-6 w-40 rounded-full" />{" "}
          </div>

          <div className="w-full space-y-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <div>Nom</div>

                <Input disabled={true} type="text" placeholder={"Nom"} />
              </div>

              <div className="space-y-2">
                <div>Numéro de téléphone</div>

                <Input
                  disabled={true}
                  type="number"
                  placeholder={"06 00 00 00"}
                />
              </div>
              <SkeletonAdressForm />
            </div>
            <Button disabled={true} className="ml-auto " type="submit">
              <Spinner size={20} />
            </Button>
          </div>
          <ButtonBackward className="mt-4" />
        </div>
      </div>
    </div>
  );
};

export default SettingsLoading;
