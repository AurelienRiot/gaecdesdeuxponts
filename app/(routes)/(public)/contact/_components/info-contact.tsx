import { LocateIcon, MailboxIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import MapDisplay from "./map";

const InfoContact = () => {
  const href =
    "https://www.google.fr/maps/place/Le+Pont+Robert,+44290+Massérac/@47.6591569,-1.9109437,765m/data=!3m1!1e3!4m6!3m5!1s0x480f7144a9b29e6b:0xab5c4202f2099f7!8m2!3d47.6590663!4d-1.9082427!16s%2Fg%2F1td3qwys?entry=ttu";
  return (
    <div className="mb-20 w-full space-y-20 py-6">
      <div className="flex w-full flex-wrap justify-between gap-4 ">
        <div className="mx-auto min-w-[175px] space-y-3">
          <MailboxIcon className="h-6 w-6 " />
          <h3 className="text-lg font-semibold">Email</h3>
          <p className="text-sm ">Envoyez-nous un message</p>
          <Link
            className="text-sm "
            href="mailto:laiteriedupontrobert@gmail.com"
          >
            laiteriedupontrobert@gmail.com
          </Link>
        </div>
        <div className="mx-auto min-w-[175px] space-y-3">
          <PhoneIcon className="h-6 w-6 " />
          <h3 className="text-lg font-semibold">Téléphone</h3>
          <p className="text-sm">Appelez-nous</p>
          <Link className="text-sm" href="tel:06 72 06 45 55">
            06 72 06 45 55
          </Link>
        </div>
        <div className="mx-auto min-w-[175px] space-y-3">
          <LocateIcon className="h-6 w-6 " />
          <h3 className="text-lg font-semibold">Adresse</h3>
          <p className="text-sm ">{"6 bis le Pont Robert 44290 MASSERAC"}</p>
          <Link className="text-sm text-blue-600" target="_blank" href={href}>
            {"Obtenir l'itinéraire"}
          </Link>
        </div>
      </div>
      {/* <div >
        <Image
          alt="Map placeholder"
          className="object-cover"
          src="/map.webp"
          fill
        />
      </div> */}
      <MapDisplay className="relative w-full " href={href} />
    </div>
  );
};

export default InfoContact;
