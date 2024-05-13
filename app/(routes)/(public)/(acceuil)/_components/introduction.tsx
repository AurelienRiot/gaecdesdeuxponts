import Image from "next/image";
import LogoAB from "@/public/Logo-AB.jpg";

const farmInfo = [
  {
    id: 1,
    imageSrc: "/vache-paturage.webp",
    description:
      "Nos vaches profitent de vastes pâturages pour un lait plus sain.",
  },
  {
    id: 2,
    imageSrc: "/vache-traite.webp",
    description:
      "Une traite respectueuse pour garantir la qualité de notre lait cru.",
  },
  // Ajoutez autant d'objets que nécessaire pour vos images et descriptions
];

function FarmIntroduction() {
  return (
    <>
      <div className="mt-[20vh] w-full space-y-2 rounded-t-md bg-background p-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h2 className="mb-4 text-4xl font-semibold">
            Introduction à la Ferme
          </h2>
          <Image
            src={LogoAB}
            placeholder="blur"
            alt="logo AB"
            width={209}
            height={100}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {farmInfo.map((info) => (
            <div
              key={info.id}
              className="flex h-auto w-full max-w-sm flex-col items-center justify-center gap-2"
            >
              <Image
                src={info.imageSrc}
                alt="Image de la ferme"
                width={256}
                height={256}
                className=" rounded-lg object-cover shadow-md"
              />

              <p className="font-bold">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FarmIntroduction;
