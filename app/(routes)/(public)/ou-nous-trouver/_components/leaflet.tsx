import { ShopCard } from "@/components/display-shops/shop-card";
import { Shop } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MapFocus from "./map-focus";
import { MakePin } from "./marker-pin";

const Leaflet = ({
  shops,
  farmShop,
  setCoordinates,
  coordinates,
}: {
  shops: Shop[];
  farmShop: Shop | null;
  setCoordinates: Dispatch<
    SetStateAction<{ long: number | undefined; lat: number | undefined }>
  >;
  coordinates: { long: number | undefined; lat: number | undefined };
}) => {
  return (
    <MapContainer
      center={[47.6600571, -1.9121281]}
      zoom={10}
      style={{ height: "70vh", width: "100%" }}
      className="rounded-md shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapFocus
        className="absolute left-12 top-3  w-fit items-center bg-transparent"
        setCoordinates={setCoordinates}
      />
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.lat, shop.long]}
          icon={MakePin("blue", shop.name, shop.imageUrl)}
        >
          <Popup>
            <ShopCard
              display="find"
              shop={shop}
              key={shop.name}
              coordinates={coordinates}
            />{" "}
          </Popup>
          <Tooltip direction="top" offset={[0, -65]} opacity={1}>
            <span>{"Afficher"}</span>
          </Tooltip>
        </Marker>
      ))}
      {farmShop && (
        <Marker
          position={[farmShop.lat, farmShop.long]}
          icon={MakePin("red", farmShop.name, farmShop.imageUrl)}
        >
          <Popup>
            <ShopCard
              display="find"
              shop={farmShop}
              coordinates={coordinates}
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

export default Leaflet;
