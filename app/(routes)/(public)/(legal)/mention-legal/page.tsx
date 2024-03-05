const MentionLegalPage = () => {
  return (
    <section className="flex flex-col max-w-5xl gap-4 pt-12 mx-auto mb-10 text-lg">
      <h1 className="text-3xl text-center">Mention légales</h1>
      <p className="flex flex-col">
        <span>
          {" "}
          <strong> Nom commercial : </strong> RIOT TECH
        </span>
        <span>
          <strong> Registre Commerce : </strong> RCS Lorient 844 513 275
        </span>
        <span>
          <strong>E-mail : </strong>contact@riottech.fr
        </span>
        <span>RIOT TECH</span>
        <span>Kervihan </span>
        <span>56930 Pluméliau-Bieuzy</span>
        <span>France: +33(0)644839083</span>
        <span>
          <strong>Coordonnées de l&apos;hébergeur : </strong>SCALEWAY ( SAS au
          capital de 214 000 €)
        </span>
        <span>
          <strong>Siège social : </strong> 8 rue de la Ville l’Evêque, 75008
          Paris.
        </span>
      </p>
      <h2 className="text-2xl text-center">PRÉAMBULE</h2>
      <p>
        Toutes les commandes effectuées sur le site sont soumises aux présentes
        conditions générales de vente. RIOT TECH se réserve le droit d’adapter
        ou de modifier à tout moment les présentes, la version des conditions
        générales de vente applicable à toute transaction étant celle figurant
        en ligne sur le site riottech.fr au moment de la commande.
      </p>
      <h2 className="text-2xl text-center">Propriété intellectuelle</h2>
      <p>
        Le présent site internet ainsi que l’ensemble de ses contenus (notamment
        les données, informations, photos, logos et marques) sont la propriété
        exclusive de RIOT TECH ou de ses partenaires. Toute reproduction,
        représentation, traduction, adaptation ou citation, intégrale ou
        partielle, quel qu’en soit le procédé ou le support, est strictement
        interdite en dehors des cas prévus par la loi ou expressément autorisés
        par leur propriétaire. Photos non contractuelles.
      </p>

      <h2 className="text-2xl text-center">Données personnelles</h2>
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
