"use client";

import { LocationMarker } from "@/app/(routes)/(public)/ou-nous-trouver/_components/location-marker";
import { Button, IconButton, LoadingButton, buttonVariants } from "@/components/ui/button";

import AddressAutocomplete from "@/actions/adress-autocompleteFR";
import { createDirectionUrl } from "@/components/google-events";
import { Form, FormButton, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import useScrollToHashOnMount from "@/hooks/use-scroll-to-hash";
import useServerAction from "@/hooks/use-server-action";
import { addressFormatter, cn, svgToDataUri } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Address } from "@prisma/client";
import "leaflet/dist/leaflet.css";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { FaDotCircle } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { GiPositionMarker } from "react-icons/gi";
import { toast } from "sonner";
import "../../../(public)/ou-nous-trouver/_components/marker.css";
import getDirection from "../../calendar/_actions/get-direction";
import getTodaysOrders from "../_actions/get-todays-orders";
import AddressModal from "./address-modal";
import DatePicker from "./date-picker";
import { destination, directionSchema, origin, type DirectionFormValues, type Point } from "./direction-schema";

export type UserAndShop = {
  label: string;
  address: string;
  image?: string | null;
  latitude?: number;
  longitude?: number;
};

export const DirectionForm = ({ usersAndShops }: { usersAndShops: UserAndShop[] }) => {
  const { serverAction } = useServerAction(getDirection);
  const [open, setOpen] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [reorderedWaypoints, setReorderedWaypoints] = useState<Point[]>([]);
  const [modalProps, setModalProps] = useState<{
    onValueChange: (address: Point) => void;
    value: Point;
  }>();
  useScrollToHashOnMount();

  const action = "Obtenir le trajet obtimisé";

  const form = useForm<DirectionFormValues>({
    resolver: zodResolver(directionSchema),
    defaultValues: {
      origin,
      destination,
      waypoints: [
        { label: "" },
        { label: "" },
        // "3, le Clos Cheny, 44290, Guémené-Penfao, FR",
        // "7 Rue de l'Eglise 44290 Guémené-Penfao",
        // "1 Rue de l'Hotel de Ville 44290 Guémené-Penfao",
        // "6 Rue de Plessé, 44460, Avessac, FR",
        // "17 Place Nominoë, 35600, Bains-sur-Oust, FR",
      ],
    },
  });

  const waypoints = form.watch("waypoints");

  const onSubmit = async (data: DirectionFormValues) => {
    function onSuccess(result?: number[]) {
      if (result) {
        const reordered = result.map((index) => waypoints[index]);
        setReorderedWaypoints(reordered);
        setOpen(true);
        form.setValue("waypoints", reordered);
      }
    }
    await serverAction({ data, onSuccess, toastOptions: { position: "top-center" } });
  };

  useEffect(() => {
    if (modalProps) {
      setOpenAddressModal(true);
    }
  }, [modalProps]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative space-y-8">
        <SuccessModal
          isOpen={open}
          onClose={() => setOpen(false)}
          usersAndShops={usersAndShops}
          reorderedWaypoints={reorderedWaypoints}
        />
        <AddressModal
          isOpen={openAddressModal}
          setIsOpen={setOpenAddressModal}
          onValueChange={modalProps?.onValueChange}
          usersAndShops={usersAndShops}
          value={modalProps?.value}
        />
        <div className="space-y-4 relative pl-6">
          <DottedLine />
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl bold flex gap-1 justify-start items-center relative">
                  <DatePicker usersAndShops={usersAndShops} />
                  Départ
                  <LocationMarker
                    onAddressFound={({ address, latitude, longitude }) => {
                      if (address) {
                        form.setValue("origin", { label: address, latitude, longitude });
                      } else {
                        toast.error("Erreur de localisation", { position: "top-center" });
                      }
                    }}
                  />
                  <TodaysOrders usersAndShops={usersAndShops} />
                </FormLabel>

                <FormControl>
                  <ButtonAddressModal
                    ref={field.ref}
                    value={field.value}
                    index={"origin"}
                    usersAndShops={usersAndShops}
                    onClick={() => {
                      setModalProps(() => ({ onValueChange: field.onChange, value: field.value }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <WaypointsForm usersAndShops={usersAndShops} setModalProps={setModalProps} />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl bold">
                  Destination
                  <LocationMarker
                    onAddressFound={({ address }) => {
                      if (address) {
                        field.onChange(address);
                      } else {
                        toast.error("Erreur de localisation", { position: "top-center" });
                      }
                    }}
                  />
                </FormLabel>
                <FormControl>
                  <ButtonAddressModal
                    ref={field.ref}
                    value={field.value}
                    index={"destination"}
                    usersAndShops={usersAndShops}
                    onClick={() => {
                      setModalProps(() => ({ onValueChange: field.onChange, value: field.value }));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormButton className="w-full">{action}</FormButton>
      </form>
    </Form>
  );
};

function SuccessModal({
  isOpen,
  onClose,
  reorderedWaypoints,
  usersAndShops,
}: { isOpen: boolean; onClose: () => void; reorderedWaypoints: Point[]; usersAndShops: UserAndShop[] }) {
  const form = useFormContext<DirectionFormValues>();
  const origin = form.watch("origin");
  const destination = form.watch("destination");

  const directionString = createDirectionUrl({
    origin: origin.label,
    destination: destination.label,
    addresses: reorderedWaypoints.map(({ label }) => label),
  });

  return (
    <Modal
      className=" max-h-[90%] w-[90%] overflow-y-scroll rounded-md"
      title="Trajet obtimisé"
      description="Le trajet obtimisé a été généré."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 ">
        <Link
          href={directionString}
          target="_blank"
          className="flex items-center justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-200"
        >
          <FaMapLocationDot className="h-5 w-5 mr-3" />
          Accéder au trajet optimisé
        </Link>
        {reorderedWaypoints.map((value, index) => {
          const image = usersAndShops.find((shop) => shop.address === value.label)?.image;
          const label = usersAndShops.find((shop) => shop.address === value.label)?.label;
          return (
            <div className="flex gap-1 justify-center items-center" key={index + value.label}>
              <div
                className={cn(buttonVariants({ variant: "default", size: "icon" }), "bg-green-500 hover:bg-green-600")}
              >
                {index + 1}
              </div>

              <div
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  " w-full text-left overflow-hidden whitespace-nowrap pl-2 relative flex justify-start",
                )}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white from-85%" />
                <Image
                  src={image ? image : "/skeleton-image.webp"}
                  alt={"image"}
                  width={24}
                  height={24}
                  className="mr-2 h-4 w-4 object-contain rounded-sm"
                />
                <span className=""> {value.label ? (label ? label : value.label) : "Entrer une adresse"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

function WaypointsForm({
  usersAndShops,
  setModalProps,
}: {
  usersAndShops: UserAndShop[];
  setModalProps: ({
    onValueChange,
    value,
  }: {
    onValueChange: (address: Point) => void;
    value: Point;
  }) => void;
}) {
  const form = useFormContext<DirectionFormValues>();

  const error = form.control.getFieldState("waypoints").error;

  async function addWaypoint() {
    const waypoints = form.getValues("waypoints");
    if (waypoints.length === 20) {
      toast.error("Vous ne pouvez pas ajouter plus de 20 points de passages");
      return;
    }
    form.setValue("waypoints", [...waypoints, { label: "" }]);
    setTimeout(() => {
      const button = document.getElementById(`button-${waypoints.length}`);
      if (button) {
        button.click();
      }
    }, 0);
  }

  function removeWaypoint(index: number) {
    const waypoints = form.getValues("waypoints");
    waypoints.splice(index, 1);
    form.setValue("waypoints", waypoints);
  }
  return (
    <FormField
      control={form.control}
      name="waypoints"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel className="text-xl bold">Points de passages</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="space-y-4 relative">
                <div className=" w-4 h-full bg-background absolute -top-[6px] -left-7 " />

                {field.value.map((value, index) => (
                  <FormField
                    key={index + value.label}
                    control={form.control}
                    name={`waypoints.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <IconButton
                              type="button"
                              Icon={X}
                              onClick={() => removeWaypoint(index)}
                              className="absolute -top-2 -right-2 size-5 p-1 text-destructive-foreground bg-destructive z-10 border-none md:opacity-0  group-hover:opacity-100  transition-opacity duration-300"
                            />
                            <ButtonAddressModal
                              ref={field.ref}
                              value={field.value}
                              index={index}
                              usersAndShops={usersAndShops}
                              onClick={() => {
                                setModalProps({ onValueChange: field.onChange, value: field.value });
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type="button"
                onClick={addWaypoint}
                variant={"outline"}
                className="border-dashed w-full border-primary "
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un point
              </Button>
            </div>
          </FormControl>
          {!!error?.root && <p className={cn("text-sm font-medium text-destructive")}>{error.root.message}</p>}
        </FormItem>
      )}
    />
  );
}

type ButtonAddressModalProps = {
  usersAndShops: UserAndShop[];
  value: Point;
  index: number | string;
  onClick: () => void;
};

const ButtonAddressModal = forwardRef<HTMLButtonElement, ButtonAddressModalProps>(
  ({ usersAndShops, onClick, value, index }, ref) => {
    const image = usersAndShops.find((u) => u.address === value.label)?.image;
    const label = usersAndShops.find((u) => u.address === value.label)?.label;

    return (
      <Button
        id={"button-" + index}
        type={"button"}
        variant="outline"
        className={cn(" w-full text-left  pl-2 relative flex justify-start ")}
        onClick={onClick}
        ref={ref}
      >
        {index === "origin" ? (
          <div className="pb-3 pt-12 bg-background absolute -top-11 -left-8 ">
            <GiPositionMarker className="size-6 text-red-600 " />
          </div>
        ) : index === "destination" ? (
          <div className="pb-10 pt-2 bg-background absolute -top-1 -left-8 ">
            <GiPositionMarker className="size-6 text-green-600 " />
          </div>
        ) : (
          <div className="pb-[14px] pt-2 bg-background absolute top-1 -left-[29px] ">
            <FaDotCircle className="size-4 text-blue-600 " />
          </div>
        )}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background from-80% via-95% to-transparent  " />
        <Image
          src={image ? image : "/skeleton-image.webp"}
          alt={"image"}
          width={24}
          height={24}
          className="mr-2 h-4 w-4 object-contain rounded-sm"
        />
        <span className={cn("overflow-hidden whitespace-nowrap", !value ? "opacity-50" : "")}>
          {" "}
          {value.label ? (label ? label : value.label) : "Entrer une adresse"}
        </span>
      </Button>
    );
  },
);

function DottedLine() {
  return (
    <>
      <style jsx>{`
    .dotted-line {
      background-image: url("${svgToDataUri(
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" >
        <circle cx="4" cy="4" r="4" fill="#E4E4E7" />
        </svg>`,
      )}"); 
      background-repeat: repeat-y; 
      }
      `}</style>
      <div className="dotted-line w-4 h-full top-0 left-0 absolute" />
    </>
  );
}

function TodaysOrders({ usersAndShops }: { usersAndShops: UserAndShop[] }) {
  const form = useFormContext<DirectionFormValues>();
  const { serverAction, loading } = useServerAction(getTodaysOrders);

  function handleOnClick() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    async function onSuccess(
      result?: {
        user: { address: Address | null };
      }[],
    ) {
      if (!result) return;

      const addresses: Point[] = await Promise.all(
        result.map(async (order) => {
          const address = addressFormatter(order.user.address);
          if (!address) {
            return { label: "" };
          }

          const user = usersAndShops.find(
            (user) => user.address && (address.includes(user.address) || user.address.includes(address)),
          );

          let latitude = user?.latitude || order.user.address?.latitude;
          let longitude = user?.longitude || order.user.address?.longitude;
          if (!latitude || !longitude) {
            const suggestions = await AddressAutocomplete(address);
            if (suggestions.length > 0) {
              latitude = suggestions[0].latitude;
              longitude = suggestions[0].longitude;
            }
          }
          if (user) {
            return { label: user.address, latitude, longitude };
          }
          return { label: address, latitude, longitude };
        }),
      );
      form.setValue("waypoints", addresses);
    }
    serverAction({ data: { date: today }, onSuccess });
  }

  return (
    <LoadingButton
      disabled={loading}
      variant="outline"
      className="w-fit text-sm px-2 py-1 absolute -top-0 border-dashed right-0 h-auto"
      onClick={handleOnClick}
    >
      Commandes du jour
    </LoadingButton>
  );
}
