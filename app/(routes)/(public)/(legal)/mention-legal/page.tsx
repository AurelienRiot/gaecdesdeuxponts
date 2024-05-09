const MentionLegalPage = () => {
  return (
    <section className="mx-auto mb-10 flex max-w-5xl flex-col gap-4 pt-12 text-lg">
      <h1 className="text-center text-3xl">Mention légales</h1>
      <p className="flex flex-col">
        <span>
          {" "}
          <strong> Nom commercial : </strong> Laiterie du Pont Robert
        </span>
        <span>
          <strong> Registre Commerce : </strong> SIRET 844 554 147 00018
        </span>
        <span>
          <strong>E-mail : </strong>laiteriedupontrobert@gmail.com
        </span>
        <span>Laiterie du Pont Robert</span>
        <span>6 bis le pont robert </span>
        <span>44290 MASSERAC</span>
        <span>France: +33(0) 6 72 06 45 55</span>
        {/* <span>
          <strong>Coordonnées de l&apos;hébergeur : </strong>SCALEWAY ( SAS au
          capital de 214 000 €)
        </span>
        <span>
          <strong>Siège social : </strong> 8 rue de la Ville l’Evêque, 75008
          Paris.
        </span> */}
      </p>
      <h2 className="text-center text-2xl">PRÉAMBULE</h2>
      <p>
        Toutes les commandes effectuées sur le site sont soumises aux présentes
        conditions générales de vente. Laiterie du Pont Robert se réserve le
        droit d’adapter ou de modifier à tout moment les présentes, la version
        des conditions générales de vente applicable à toute transaction étant
        celle figurant en ligne sur le site laiteriedupontrobert.fr au moment de
        la commande.
      </p>
      <h2 className="text-center text-2xl">Propriété intellectuelle</h2>
      <p>
        Le présent site internet ainsi que l’ensemble de ses contenus (notamment
        les données, informations, photos, logos et marques) sont la propriété
        exclusive de Laiterie du Pont Robert ou de ses partenaires. Toute
        reproduction, représentation, traduction, adaptation ou citation,
        intégrale ou partielle, quel qu’en soit le procédé ou le support, est
        strictement interdite en dehors des cas prévus par la loi ou
        expressément autorisés par leur propriétaire. Photos non contractuelles.
      </p>

      <h2 className="text-center text-2xl">Données personnelles</h2>
      <p>
        Vous pouvez visiter notre site sur Internet sans avoir à décliner votre
        identité ou à fournir des informations personnelles vous concernant.
        Cependant, nous pouvons parfois vous demander des informations pour
        traiter une commande, identifier une demande de support technique,
        établir une correspondance, fournir un abonnement ou soumettre une
        candidature à un poste.{" "}
      </p>
    </section>
  );
};

export default MentionLegalPage;
