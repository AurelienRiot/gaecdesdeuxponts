import { Icons } from "@/components/icons";
import { LocateIcon, MailboxIcon, Network, PhoneIcon } from "lucide-react";
import Link from "next/link";
import MapDisplay from "./map";

export const href =
  "    https://www.google.com/maps/place/Laiterie+du+Pont+Robert/@47.6600571,-1.9121281,17z/data=!3m1!4b1!4m6!3m5!1s0x480f71090cddeeb3:0x3d5bf2c6c171230f!8m2!3d47.6600535!4d-1.9095532!16s%2Fg%2F11v_0vq263?entry=ttu";
const InfoContact = () => {
  const features = [
    {
      Icone: MailboxIcon,
      title: "Email",
      description: "Envoyez-nous un message",
      link: (
        <Link className="pt-4 text-sm" href="mailto:laiteriedupontrobert@gmail.com">
          laiteriedupontrobert@gmail.com
        </Link>
      ),
    },
    {
      Icone: PhoneIcon,
      title: "Téléphone",
      description: "Appelez-nous",
      link: (
        <Link className="pt-4 text-sm" href="tel:06 72 06 45 55">
          06 72 06 45 55
        </Link>
      ),
    },
    {
      Icone: LocateIcon,
      title: "Adresse",
      description: "6 bis le Pont Robert 44290 MASSERAC",
      link: (
        <Link className="pt-4 text-base text-blue-600" target="_blank" href={href}>
          {"Obtenir l'itinéraire"}
        </Link>
      ),
    },
    {
      Icone: Network,
      title: "Réseau Sociaux",
      description: "Retrouvez nous sur les reseaux sociaux",
      link: (
        <div className="justify-between flex items-center gap-4 sm:gap-8">
          <Link target="_blank" href={"https://www.facebook.com/profile.php?id=61559928455527"}>
            <Icons.Facebook className="size-6" />
          </Link>
          <Link target="_blank" href={"https://www.instagram.com/julie_jeanmarc"}>
            <Icons.Instagram className="size-7" />
          </Link>
          {/* <Link target="_blank" href={"https://www.leboncoin.fr/ad/autres_services/2711381825"}>
            <Icons.LeBonCoin className="size-14" />
          </Link> */}
        </div>
      ),
    },
  ];

  return (
    <div className="grid-col-1 grid w-full gap-10 py-10 lg:grid-cols-2">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map(({ Icone, title, description, link }) => (
          <div
            key={title}
            className="mx-auto flex flex-col items-center space-y-3 p-4 text-center sm:mr-auto sm:text-left"
          >
            <Icone className="h-6 w-6" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-center text-sm">{description}</p>
            {link}
          </div>
        ))}
      </div>

      <MapDisplay href={href} />
    </div>
  );
};

export default InfoContact;
