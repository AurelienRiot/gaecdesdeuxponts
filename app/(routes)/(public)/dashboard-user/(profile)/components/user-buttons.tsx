import { LogoutButtonText } from "@/components/auth/auth-button";
import Link from "next/link";
import { BsGear } from "react-icons/bs";
import { FaFileInvoice } from "react-icons/fa";

export const UserButtons = () => {
  return (
    <>
      <Link href="/dashboard-user/settings" className=" text-3xl ">
        <span className="inline-flex cursor-pointer items-center gap-2 hover:underline">
          <BsGear size={20} /> Paramètres
        </span>
      </Link>
      <LogoutButtonText />
    </>
  );
};
