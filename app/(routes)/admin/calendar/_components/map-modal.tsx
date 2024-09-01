import { LocationAutocomplete } from "@/actions/adress-autocompleteFR";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import { toast } from "sonner";

function MapModal({ onValueChange }: { onValueChange: (address: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type={"button"}
        variant="outline"
        className={cn(" w-full text-left  pl-2 relative flex justify-start ")}
        onClick={() => setOpen(true)}
      >
        <GrMapLocation className="h-4 w-4 mr-2" />
        {"Chercher sur la carte"}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)} modal={true}>
        <DialogContent className="h-[90%] max-h-[90%] w-[90%] max-w-[90%]  z-[2000] ">
          <MapSelect onValueChange={onValueChange} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function MapSelect({ onValueChange }: { onValueChange: (address: string) => void }) {
  return (
    <MapContainer
      center={[47.6600571, -1.9121281]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      className="rounded-md shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onValueChange={onValueChange} />
    </MapContainer>
  );
}

function MapClickHandler({ onValueChange }: { onValueChange: (address: string) => void }) {
  useMapEvent("click", async (e) => {
    const address = await LocationAutocomplete({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    if (address.length === 0) {
      toast.error("Adresse introuvable");
      return;
    }
    onValueChange(address[0].label);
  });

  return null; // This component does not render anything
}

export default MapModal;
