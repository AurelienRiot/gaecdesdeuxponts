import getShops from "@/actions/get-shops";
import Container from "@/components/ui/container";
import { PlacePicker } from "./components/place";

const Find = async () => {
  const shops = await getShops();
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
