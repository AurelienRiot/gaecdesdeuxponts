import Image from "next/image";

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
      <div className="mt-[20vh] w-full rounded-t-md bg-background p-4 text-center">
        <h2 className="mb-4 font-semibold sm:text-2xl  md:text-3xl lg:text-4xl">
          Introduction à la Ferme
        </h2>
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
