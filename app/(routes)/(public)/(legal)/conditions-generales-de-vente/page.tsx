import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions générales de vente de Laiterie du Pont Robert",
};

const ConditionsVentePage = () => {
  return (
    <section className="mx-auto mb-10 flex max-w-5xl flex-col gap-4 px-4 pt-12 text-lg">
      <h1 className="text-center text-3xl">Conditions générales de vente </h1>
      <p>
        Les présentes conditions de vente sont conclues d&apos;une part par la société Laiterie du Pont Robert dont le
        siège social est situé au 6 bis le pont robert 44290 MASSERAC, immatriculée au registre du commerce et des
        sociétés de Saint Nazaire sous le numéro SIRET 844 554 147 00018 ci-après dénommée “ Laiterie du Pont Robert ”
        et d&apos;autre part, par toute personne physique ou morale souhaitant procéder à un achat via le site Internet
        “ laiteriedupontrobert.fr ” dénommée ci-après “ l&apos;acheteur ”.
      </p>
      <h2 className="text-center text-2xl">Objet</h2>
      <p>
        Les présentes conditions de vente visent à définir les relations contractuelles entre Laiterie du Pont Robert et
        l&apos;acheteur et les conditions applicables à tout achat effectué par le biais du site marchand de Laiterie du
        Pont Robert, que l&apos;acheteur soit professionnel ou particulier. <br />
        L&apos;acquisition d&apos;un bien ou d&apos;un service à travers le présent site implique une acceptation sans
        réserve par l&apos;acheteur des présentes conditions de vente. <br />
        Ces conditions de vente prévaudront sur toutes autres conditions générales ou particulières non expressément
        agréées par Laiterie du Pont Robert. Laiterie du Pont Robert se réserve de pouvoir modifier ses conditions de
        vente à tout moment. Dans ce cas, les conditions applicables seront celles en vigueur à la date de la commande
        par l&apos;acheteur.
      </p>
      <h2 className="text-center text-2xl">Caractéristiques des biens et services proposés</h2>
      <p>
        Les produits et services offerts sont ceux qui figurent dans le catalogue publié sur le site de Laiterie du Pont
        Robert. Ces produits et services sont offerts dans la limite des stocks disponibles.
        <br />
        Les photographies du catalogue sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite
        avec le produit offert, notamment en ce qui concerne les couleurs.
      </p>
      <h2 className="text-center text-2xl">Tarifs</h2>
      <p>
        Les prix figurant dans le catalogue sont des prix TTC (Toutes Taxes Comprises) en euro, le montant en euro
        correspondant au taux TVA applicable est ajouté et indiqué au règlement de la commande; tout changement du taux
        pourra être répercuté sur le prix des produits ou des services. <br />
        Laiterie du Pont Robert se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le
        prix figurant au catalogue le jour de la commande sera le seul applicable à l&apos;acheteur. <br />
        Les prix indiqués ne comprennent pas les frais de traitement de commandes, de transport et de livraison.
      </p>
      <h2 className="text-center text-2xl">Aire géographique</h2>
      <p>
        La vente en ligne des produits et services présentés dans le site est réservée aux acheteurs qui résident en
        France métropolitaine.
      </p>
      <h2 className="text-center text-2xl">Commandes</h2>
      <div>
        L&apos;acheteur, qui souhaite acheter un produit ou un service doit obligatoirement :
        <ul>
          <li>
            - remplir la fiche d&apos;identification sur laquelle il indiquera toutes les coordonnées demandées ou
            donner son numéro de client s&apos;il en a un;
          </li>
          <li>
            - remplir le bon de commande en ligne en donnant toutes les références des produits ou services choisis;
          </li>
          <li>- valider sa commande après l&apos;avoir vérifiée;</li>
        </ul>
        La confirmation de la commande entraîne acceptation des présentes conditions de vente, la reconnaissance
        d&apos;en avoir parfaite connaissance et la renonciation à se prévaloir de ses propres conditions d&apos;achat
        ou d&apos;autres conditions.
        <br />
        L&apos;ensemble des données fournies et la confirmation enregistrée vaudront preuve de la transaction. La
        confirmation vaudra signature et acceptation des opérations effectuées.
        <br />
        Le vendeur communiquera par courrier électronique la confirmation de la commande enregistrée.
      </div>
      <h2 className="text-center text-2xl">Rétractation</h2>
      <p>
        Conformément à la législation en vigueur, les produits périssables ne bénéficient pas du droit de rétractation.
        Par conséquent, les acheteurs ne peuvent pas retourner ces produits pour un échange ou un remboursement, sauf en
        cas de produit défectueux ou non conforme à la commande. Nous vous invitons à vérifier attentivement votre
        commande à la livraison.
      </p>
      <h2 className="text-center text-2xl">Livraisons</h2>
      <p>
        Les livraisons peuvent être effectuées soit à domicile pour les professionnels, soit à la Laiterie du Pont
        Robert, soit dans un point de vente partenaire selon l&apos;option choisie lors de la commande.
        <br />
        Les livraisons à domicile sont faites à l&apos;adresse indiquée dans le bon de commande, qui doit se trouver
        dans la zone géographique convenue.
        <br />
        Les risques sont à la charge de l&apos;acquéreur à compter du moment où les produits ont quitté les locaux de
        Laiterie du Pont Robert. En cas de dommage pendant le transport, une protestation motivée doit être formulée
        auprès du transporteur dans un délai de trois jours à compter de la livraison.
      </p>
      <h2 className="text-center text-2xl">Garantie</h2>
      <p>
        Tous les produits fournis par le vendeur bénéficient de la garantie légale prévue par les articles 1641 et
        suivants du Code civil.
        <br />
        En cas de non-conformité d&apos;un produit vendu, il pourra être retourné au vendeur qui le reprendra,
        l&apos;échangera ou le remboursera.
        <br />
        Toutes les réclamations, demandes d&apos;échange ou de remboursement doivent s&apos;effectuer par le site
        internet via le formulaire de contact ou à l’adresse e-mail{" "}
        <a
          href="mailto:laiteriedupontrobert@gmail.com"
          className="text-blue-600 underline-offset-2 visited:text-purple-600 hover:text-blue-800 hover:underline"
        >
          laiteriedupontrobert@gmail.com
        </a>{" "}
        dans le délai de trente jours à compter de la date de livraison.
      </p>
      <h2 className="text-center text-2xl">Responsabilité</h2>
      <p>
        Le vendeur, dans le processus de vente en ligne, n&apos;est tenu que par une obligation de moyens ; sa
        responsabilité ne pourra être engagée pour un dommage résultant de l&apos;utilisation du réseau Internet tel que
        perte de données, intrusion, virus, rupture du service, ou autres problèmes involontaires.
      </p>
      <h2 className="text-center text-2xl">Propriété intellectuelle</h2>
      <p>
        Tous les éléments du site de Laiterie du Pont Robert sont et restent la propriété intellectuelle et exclusive de
        Laiterie du Pont Robert et de ses partenaires. <br />
        Personne n&apos;est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, même
        partiellement, des éléments du site qu&apos;ils soient logiciels, visuels ou sonores. <br />
        Tout lien simple ou par hypertexte est strictement interdit sans un accord écrit exprès de Laiterie du Pont
        Robert.
      </p>{" "}
      <h2 className="text-center text-2xl">Données à caractère personnel</h2>
      <p>
        Conformément à la loi relative à l&apos;informatique, aux fichiers et aux libertés du 6 janvier 1978, les
        informations à caractère nominatif relatives aux acheteurs pourront faire l&apos;objet d&apos;un traitement
        automatisé. <br />
        Laiterie du Pont Robert se réserve le droit de collecter des informations sur les acheteurs y compris en
        utilisant des cookies, et, s&apos;il le souhaite, de transmettre à des partenaires commerciaux les informations
        collectées. <br />
        Les acheteurs peuvent s&apos;opposer à la divulgation de leurs coordonnées en le signalant à Laiterie du Pont
        Robert. De même, les utilisateurs disposent d&apos;un droit d&apos;accès et de rectification des données les
        concernant, conformément à la loi du 6 janvier 1978.
      </p>
      <h2 className="text-center text-2xl">Archivage - Preuve</h2>
      <p>
        Laiterie du Pont Robert archivera les bons de commandes et les factures sur un support fiable et durable
        constituant une copie fidèle conformément aux dispositions de l&apos;article 1348 du Code civil. <br />
        Les registres informatisés de Laiterie du Pont Robert seront considérés par les parties comme preuve des
        communications, commandes, paiements et transactions intervenus entre les parties.
      </p>
      <h2 className="text-center text-2xl">Règlement des litiges</h2>
      <p>
        Les présentes conditions de vente en ligne sont soumises à la loi Française. <br />
        En cas de litige, compétence est attribuée aux tribunaux compétents de Saint Nazaire, nonobstant pluralité de
        défendeurs ou appel en garantie.
      </p>
    </section>
  );
};

export default ConditionsVentePage;
