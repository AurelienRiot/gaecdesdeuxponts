"use client";
import { useUserContext } from "@/context/user-context";
import { UserForm } from "./_components/user-form";

const PageSettings = () => {
  const { user } = useUserContext();

  if (!user) {
    return null;
  }

  const formattedUser = {
    name: user.name || "",
    role: user.role || "",
    phone: user.phone || "",
    email: user.email || "",
    company: user.company || "",
    adress: {
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
    <div className="h-full w-full flex-col p-6  ">
      <div className=" flex-1 space-y-4 ">
        <UserForm initialData={formattedUser} />
      </div>
    </div>
  );
};

export default PageSettings;
