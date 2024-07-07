import { LocateIcon } from "lucide-react";
import Link from "next/link";
import { href } from "../../contact/_components/info-contact";

function PorteOuverte() {
  return (
    <section className="w-full p-12 md:p-24 lg:p-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center justify-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className=" tracking-tighter flex flex-col text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              <span>Portes Ouvertes</span>
              <span className="text-green-500">LAIT CRU</span>
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Rejoignez-nous tous les mercredis de Juillet.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Aux heures de la traite 17h30-19h.
            </p>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Pour les enfants</h3>
              <p className="max-w-[600px] text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                Participez à une chasse au trésor et testez vos connaissances avec notre quiz sur la ferme !
              </p>
            </div>
            {/* <div className="flex gap-4">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Réservez votre visite
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                En savoir plus
              </Link>
            </div> */}
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Dégustation gratuite</div>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Venez déguster notre lait cru lors de ces portes ouvertes !
            </p>
            <div className=" flex flex-col items-center space-y-3 p-4 text-center">
              <LocateIcon className="h-6 w-6" />
              <h3 className="text-lg font-semibold">{"Adresse"}</h3>
              <p className="text-center text-sm">{"6 bis le Pont Robert 44290 MASSERAC"}</p>
              <Link className="pt-4 text-base text-blue-600" target="_blank" href={href}>
                {"Obtenir l'itinéraire"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PorteOuverte;
