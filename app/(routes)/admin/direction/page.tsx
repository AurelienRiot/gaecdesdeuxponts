import { Separator } from "@/components/ui/separator";
import { DirectionForm } from "./_components/direction-form";
import { getAllShops } from "./_functions/get-shops";
import { getSearchUsers } from "./_functions/get-users";

export const dynamic = "force-dynamic";

const title = "Faire un trajet obtimisé";

async function DirectionPage() {
  const [users, shops] = await Promise.all([getSearchUsers(), getAllShops()]);
  const usersAndShops = users.concat(shops).sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="space-y-6 pt-6 flex justify-center  w-full ">
      <div className="mb-8  space-y-4 ">
        <div id="opti" className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-center"> {title} </h2>
        </div>
        <Separator />
        <DirectionForm usersAndShops={usersAndShops} />
      </div>
    </div>
  );
}

export default DirectionPage;
