import { ShopCard } from "@/components/display-shops/shop-card";
import type { FullShop } from "@/types";
import { useRouter } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMapEvent } from "react-leaflet";
import MapFocus from "./map-focus";
import { MakePin } from "./marker-pin";

const Leaflet = ({
  shops,
  farmShop,
}: {
  shops: FullShop[];
  farmShop: FullShop | null;
}) => {
  const router = useRouter();
  return (
    <MapContainer
      center={[47.6600571, -1.9121281]}
      zoom={12}
      style={{ height: "70vh", width: "100%" }}
      className="rounded-md shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickHandler />
      <MapFocus shops={shops} className="absolute left-12 top-3 " />
      {shops.map((shop) => (
        <Marker
          key={shop.id}
          eventHandlers={{
            click: () => {
              router.push(`/ou-nous-trouver/${shop.id}`);
            },
          }}
          position={[shop.lat, shop.long]}
          icon={MakePin("blue", shop.name, shop.imageUrl)}
        >
          {/* <Popup>
            <ShopCard display="find" shop={shop} key={shop.name} coordinates={coordinates} />{" "}
          </Popup> */}
          <Tooltip direction="top" offset={[0, -65]} opacity={1}>
            <span>{"Afficher"}</span>
          </Tooltip>
        </Marker>
      ))}
      {farmShop && (
        <Marker position={[farmShop.lat, farmShop.long]} icon={MakePin("red", farmShop.name, farmShop.imageUrl)}>
          <Popup>
            <ShopCard display="find" shop={farmShop} />{" "}
          </Popup>
          <Tooltip direction="top" offset={[0, -65]} opacity={1}>
            <span>{"Afficher"}</span>
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  );
};

const ClickHandler = () => {
  useMapEvent("click", (e) => {
    console.log("Map clicked at:", e.latlng);
  });
  return null;
};

export default Leaflet;
