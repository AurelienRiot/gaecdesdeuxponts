import { getUserName } from "@/components/table-custom-fuction";
import { Separator } from "@/components/ui/separator";
import { addressFormatter } from "@/lib/utils";
import { DirectionForm } from "./_components/direction-form";
import { getAllShops } from "./_functions/get-shops";
import { getSearchUsers } from "./_functions/get-users";

export const dynamic = "force-dynamic";

const title = "Faire un trajet obtimisé";

async function DirectionPage() {
  const usersAndShops = await Promise.all([getSearchUsers(), getAllShops()]).then(([users, shops]) => {
    const usersMap = new Map(
      users.map((user) => [
        getUserName(user),
        {
          label: getUserName(user),
          image: user.image,
          address: addressFormatter(user.address, false),
        },
      ]),
    );

    for (const shop of shops) {
      if (!usersMap.has(shop.name)) {
        usersMap.set(shop.name, {
          label: shop.name,
          image: shop.imageUrl,
          address: shop.address,
        });
      }
    }

    return Array.from(usersMap.values());
  });
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
