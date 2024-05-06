import { Icons } from "@/components/icons";
import { LocateIcon, MailboxIcon, Network, PhoneIcon } from "lucide-react";
import Link from "next/link";
import MapDisplay from "./map";

const InfoContact = () => {
  const href =
    "https://www.google.fr/maps/place/Le+Pont+Robert,+44290+Massérac/@47.6591569,-1.9109437,765m/data=!3m1!1e3!4m6!3m5!1s0x480f7144a9b29e6b:0xab5c4202f2099f7!8m2!3d47.6590663!4d-1.9082427!16s%2Fg%2F1td3qwys?entry=ttu";
  const features = [
    {
      Icone: MailboxIcon,
      title: "Email",
      description: "Envoyez-nous un message",
      link: (
        <Link
          className="pt-4 text-sm "
          href="mailto:laiteriedupontrobert@gmail.com"
        >
          laiteriedupontrobert@gmail.com
        </Link>
      ),
    },
    {
      Icone: PhoneIcon,
      title: "Téléphone",
      description: "Appelez-nous",
      link: (
        <Link className="pt-4 text-sm " href="tel:06 72 06 45 55">
          06 72 06 45 55
        </Link>
      ),
    },
    {
      Icone: LocateIcon,
      title: "Adresse",
      description: "6 bis le Pont Robert 44290 MASSERAC",
      link: (
        <Link
          className="pt-4 text-base text-blue-600"
          target="_blank"
          href={href}
        >
          {"Obtenir l'itinéraire"}
        </Link>
      ),
    },
    {
      Icone: Network,
      title: "Réseau Sociaux",
      description: "Retrouvez nous sur les reseaux sociaux",
      link: (
        <div className="justify-left flex items-center gap-4 sm:gap-8">
          <Link
            target="_blank"
            href={"https://www.facebook.com/laiterie.du.pont.robert"}
          >
            <Icons.Facebook className="size-6" />
          </Link>
          <Link
            target="_blank"
            href={"https://www.instagram.com/laiterie.du.pont.robert"}
          >
            <Icons.Instagram className="size-7" />
          </Link>
          <Link target="_blank" href={"https://www.leboncoin.fr/"}>
            <Icons.LeBonCoin className="size-14" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="grid-col-1 grid w-full gap-10 py-10 lg:grid-cols-2">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 ">
        {features.map(({ Icone, title, description, link }) => (
          <div
            key={title}
            className="mx-auto flex flex-col items-center space-y-3 p-4 text-center sm:mr-auto sm:text-left"
          >
            <Icone className="h-6 w-6 " />
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
