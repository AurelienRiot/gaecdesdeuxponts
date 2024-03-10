import Container from "@/components/ui/container";
import { PlacePicker } from "./components/place";
import { Shop } from "@prisma/client";

const shops: Shop[] = [
  {
    id: "1",
    name: "CHEVRERIE DES PERRIERES",
    address: "25 Entrelandes, 35390 Sainte-Anne-sur-Vilaine ",
    phone: "02 99 08 77 77",
    email: "chevres.perrieres@orange.fr",
    description: "Shop 1 description",
    lat: 47.747504,
    long: -1.814653,
    imageUrl: "",
    website: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "AMAP Du Champ au Panier",
    address: "12 rue des arcades, 35390 La Dominelais",
    phone: "",
    email: "",
    description: "Shop 2 description",
    lat: 47.7623234,
    long: -1.6834668,
    imageUrl: "",
    website: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "GAEC DE LA PINAIS",
    address: "23 bis La Pinais, 35480 Guipry-Messac",
    phone: "02 99 34 21 20",
    email: "fermedelapinais@orange.fr",
    description: "Shop 3 description",
    lat: 47.823978,
    long: -1.761831,
    imageUrl: "",
    website: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const Find = () => {
  return (
    <Container className="my-8 space-y-8 p-2">
      <div className="">
        <h1 className="text-4xl font-bold">Trouver un magasin</h1>
        <p className="text-lg">
          Trouvez le magasin le plus proche de chez vous
        </p>
      </div>
      <PlacePicker shops={shops} />
    </Container>
  );
};

export default Find;
