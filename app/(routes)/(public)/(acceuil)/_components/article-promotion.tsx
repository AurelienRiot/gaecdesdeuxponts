const ArticlePromotion = () => {
  return (
    <div id="la-ferme" className="mx-auto max-w-4xl rounded-lg bg-white p-6 pt-20 shadow-lg">
      <div className="flex flex-col items-center text-center">
        <h2 className="mb-2 text-2xl font-bold text-green-600">GAEC des 2 Ponts de Massérac</h2>
        <p className="text-gray-700">
          LAURÉAT DU TERRITOIRE Marais de Vilaine - En lice pour le Concours Général des Pratiques Agro-écologiques –
          Prairies et Parcours
        </p>
        <span className="text-sm text-gray-600">CATÉGORIE: Fauche prioritaire</span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-green-500">FOCUS PROJET</h3>
        <p className="text-gray-700">
          {`  Au GAEC des 2 Ponts, Julie et Jean-Marc RIOT élèvent 60 vaches
          laitières en AB dans la vallée Don, intégrée au territoire des Marais
          de Vilaine. C'est une jeune exploitation d'une surface totale de
          130ha, dont 40% sont des prairies naturelles humides de fond de
          vallée, régulièrement inondées en hiver par les crues de la rivière
          Don...`}
        </p>
      </div>
    </div>
  );
};

export default ArticlePromotion;
