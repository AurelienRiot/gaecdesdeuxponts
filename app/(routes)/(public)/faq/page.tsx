import Container from "@/components/ui/container";
import { Accordion2 } from "./accordeons";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FAQ sur le Lait Cru",
    openGraph: {
      title: "FAQ sur le Lait Cru",
      description:
        "Trouvez les réponses aux questions fréquemment posées sur notre lait cru, ses bienfaits, et comment nous assurons sa qualité et sécurité pour vous.",
    },
  };
}

const faqData = [
  {
    question: "Quels sont les bienfaits du lait cru ?",
    answer: [
      "Le lait cru préserve tous les enzymes, vitamines et minéraux naturels.",
      "Il offre une expérience gustative riche.",
      "Il présente des bienfaits pour la santé améliorés par rapport au lait pasteurisé.",
    ],
  },
  {
    question: "Le lait cru est-il sûr ?",
    answer: [
      "Le lait cru est produit dans le respect des normes sanitaires strictes.",
      "Il est important de le consommer rapidement et de le garder réfrigéré.",
    ],
  },
  {
    question: "Comment doit-on conserver le lait cru ?",
    answer: [
      "Le lait cru doit être réfrigéré immédiatement après l'achat.",
      "Il est conseillé de le stocker à une température inférieure à 4°C.",
      "Consommez-le dans les 5 jours pour garantir sa fraîcheur et sa sécurité.",
    ],
  },
  {
    question: "Peut-on faire bouillir le lait cru ?",
    answer: [
      "Oui, vous pouvez bouillir le lait cru pour tuer les bactéries potentiellement dangereuses.",
      "La pasteurisation à domicile consiste à chauffer le lait à au moins 63°C pendant 30 minutes ou à 72°C pendant 15 secondes.",
      "Notez que cela peut modifier le goût et réduire certains bienfaits nutritionnels du lait cru.",
    ],
  },
  {
    question: "Le lait cru convient-il aux enfants ?",
    answer: [
      "Les opinions varient concernant la consommation de lait cru par les enfants.",
      "Il est important de consulter un professionnel de santé pour discuter des risques potentiels et des avantages avant de donner du lait cru aux enfants.",
    ],
  },
  {
    question:
      "Quelle est la différence entre le lait cru et le lait pasteurisé ?",
    answer: [
      "Le lait cru est le lait tel qu'il est collecté à la ferme, sans traitement thermique.",
      "Le lait pasteurisé a été chauffé à une certaine température pour tuer les bactéries, ce qui affecte également certains nutriments et enzymes.",
    ],
  },
  {
    question:
      "Peut-on utiliser le lait cru pour faire des produits laitiers maison ?",
    answer: [
      "Oui, le lait cru est souvent utilisé pour faire du fromage, du yaourt, et d'autres produits laitiers maison.",
      "Ses enzymes naturels et sa flore bactérienne peuvent contribuer à un goût plus riche et à une meilleure fermentation.",
    ],
  },
  {
    question:
      "Y a-t-il des risques sanitaires associés à la consommation de lait cru ?",
    answer: [
      "Le lait cru peut contenir des bactéries nocives responsables de maladies d'origine alimentaire.",
      "Il est crucial de s'approvisionner auprès de fermes qui suivent des pratiques strictes de manipulation et de production pour minimiser ces risques.",
    ],
  },
  {
    question: "Comment savoir si le lait cru est de bonne qualité ?",
    answer: [
      "Assurez-vous que la ferme suit des pratiques d'hygiène rigoureuses.",
      "Le lait doit être clair, sans odeur désagréable, et provenir de vaches en bonne santé.",
      "Demandez si la ferme effectue des tests réguliers pour détecter la présence de bactéries pathogènes.",
    ],
  },
  {
    question: "Le lait cru a-t-il un meilleur goût que le lait pasteurisé ?",
    answer: [
      "Beaucoup de personnes trouvent que le lait cru a un goût plus riche et plus complet en raison de sa teneur naturelle en graisses et en enzymes non altérées par la chaleur.",
      "Cependant, le goût peut varier en fonction de l'alimentation des vaches et des pratiques de la ferme.",
    ],
  },
];

const FAQPage = () => {
  return (
    <Container className=" px-4 py-12 ">
      <div className="mx-auto max-w-4xl">
        <div className="mb-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary lg:text-5xl">
            FAQ sur le Lait Cru
          </h1>
          <p className="text-secondary-foreground">
            Trouvez les réponses aux questions fréquemment posées sur notre lait
            cru, ses bienfaits, et comment nous assurons sa qualité et sécurité
            pour vous.
          </p>
        </div>
      </div>

      {/* <Accordion type="single" collapsible className="mt-8 w-full">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="group">
            <AccordionTrigger className="group-first:rounded-t-md group-last:rounded-b-md ">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <ul className=" my-10 list-inside list-disc">
                {faq.answer.map((point, pointIndex) => (
                  <li className="p-2" key={pointIndex}>
                    {point}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion> */}

      <Accordion2 data={faqData} />
    </Container>
  );
};

export default FAQPage;
