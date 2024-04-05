import { checkPro } from "@/components/auth/checkAuth";
import { Suspense } from "react";
import { OrderTable } from "./components/order-table";
import ProTab from "./components/pro-tab";
import ProfilTab from "./components/profil-tab";
import { Tab, Tabs, TabsProvider } from "./components/tabs-animate";
import { UserFromWrapper } from "./components/user-form";

const DashboardUser = async ({
  searchParams,
}: {
  searchParams: { tab: string };
}) => {
  const role = await checkPro();

  const tabs: Tab[] = [
    {
      title: "Profil",
      iconId: "user",
      content: <ProfilTab />,
    },
    {
      title: "Conmmandes",
      iconId: "orders",
      content: (
        <div className="p-6">
          <OrderTable />
        </div>
      ),
    },
    {
      title: "Modifier le profil",
      iconId: "settings",
      content: <UserFromWrapper />,
    },
  ];

  if (role === "pro") {
    tabs.push({
      title: "Prduits Pro",
      iconId: "store",

      content: (
        <Suspense fallback={null}>
          <ProTab />
        </Suspense>
      ),
    });
  }

  return (
    <div className=" relative mx-auto mt-4 flex h-[calc(100vh-297px)] w-full  justify-between gap-4   pr-4 [perspective:1000px] sm:h-[calc(100vh-220px)]">
      <TabsProvider initialTabs={tabs} activeTab={searchParams.tab}>
        <Tabs tabs={tabs} />
      </TabsProvider>
    </div>
  );
};

export default DashboardUser;
