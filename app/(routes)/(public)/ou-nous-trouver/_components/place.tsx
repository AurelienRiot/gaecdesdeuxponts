"use client";
import { AddressInput } from "@/components/display-shops/address-input";
import NameInput from "@/components/display-shops/name-input";
import { ShopCard } from "@/components/display-shops/shop-card";
import { Shop } from "@prisma/client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MapFocus from "./map-focus";
import { MakePin } from "./marker-pin";

const PlacePicker = ({
  shops,
  farmShop,
}: {
  shops: Shop[];
  farmShop: Shop | null;
}) => {
  const [coordinates, setCoordinates] = useState<{
    long: number | undefined;
    lat: number | undefined;
  }>({ lat: undefined, long: undefined });
  const [sortedShops, setSortedShops] = useState<Shop[]>(shops);

  return (
    <>
      <Leaflet shops={shops} farmShop={farmShop} />
      <div className="flex flex-wrap items-center justify-start gap-2">
        <AddressInput
          setSortedShops={setSortedShops}
          setCoordinates={setCoordinates}
          shops={shops}
        />
        <NameInput
          setSortedShops={setSortedShops}
          shops={shops}
          className="w-fit"
        />
      </div>

      <div className=" grid grid-cols-1 items-center justify-items-center  gap-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sortedShops.map((shop) => (
          <ShopCard
            display="find"
            shop={shop}
            key={shop.name}
            coordinates={coordinates}
          />
        ))}
      </div>
    </>
  );
};

const Leaflet = ({
  shops,
  farmShop,
}: {
  shops: Shop[];
  farmShop: Shop | null;
}) => {
  return (
    <MapContainer
      center={[47.6591569, -1.9109437]}
      zoom={10}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapFocus className="absolute left-12 top-3  w-fit items-center bg-transparent" />
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat, shop.long]}
          icon={MakePin("blue", shop.name)}
        >
          <Popup>
            <ShopCard
              display="find"
              shop={shop}
              key={shop.name}
              coordinates={{ long: undefined, lat: undefined }}
            />{" "}
          </Popup>
          <Tooltip direction="bottom" offset={[0, -25]} opacity={1}>
            <span>{"Afficher"}</span>
          </Tooltip>
        </Marker>
      ))}
      {farmShop && (
        <Marker
          position={[farmShop.lat, farmShop.long]}
          icon={MakePin("red", farmShop.name)}
        >
          <Popup>
            <ShopCard
              display="find"
              shop={farmShop}
              coordinates={{ long: undefined, lat: undefined }}
            />{" "}
          </Popup>
          <Tooltip direction="top" offset={[0, -65]} opacity={1}>
            <span>{"Afficher"}</span>
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default PlacePicker;
