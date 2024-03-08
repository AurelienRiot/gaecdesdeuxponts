import GetUser from "@/actions/get-user";
import { UserForm } from "./components/user-form";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const user = await GetUser();

  if (!user) {
    redirect("/login");
  }

  const formattedUser = {
    name: user.name || "",
    phone: user.phone || "",
    email: user.email || "",
    address: {
      label: user.address[0]?.label || "",
      city: user.address[0]?.city || "",
      country: user.address[0]?.country || "FR",
      line1: user.address[0]?.line1 || "",
      line2: user.address[0]?.line2 || "",
      postalCode: user.address[0]?.postalCode || "",
      state: user.address[0]?.state || "",
    },
  };

  return (
    <div className="flex-col p-8 pt-6">
      <div className="mb-8 flex-1 space-y-4 ">
        <UserForm initialData={formattedUser} />
      </div>
    </div>
  );
};

export default SettingsPage;
