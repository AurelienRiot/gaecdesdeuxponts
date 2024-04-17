import { checkPro } from "@/components/auth/checkAuth";
import IconButton from "@/components/ui/icon-button";
import { CategoriesProvider } from "@/context/categories-context";
import { ProductsProvider } from "@/context/products-context";
import { UserProvider } from "@/context/user-context";

import { redirect } from "next/navigation";
import React from "react";
import { ProfilNavBar } from "./nav-components";

export const metadata = {
  title: " Laiterie du Pont Robert - Profil utilisateur",
  description: "Profil utilisateur Laiterie du Pont Robert",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await checkPro();

  if (role === "admin") {
    redirect("/admin");
  }

  return (
    <UserProvider>
      <CategoriesProvider isPro={role === "pro"}>
        <ProductsProvider isPro={role === "pro"}>
          <div className="      relative flex min-h-[350px]   justify-between gap-4   pl-20 pr-4 ">
            <ProfilNavBar isPro={role === "pro"} />
            {children}
          </div>{" "}
        </ProductsProvider>
      </CategoriesProvider>
    </UserProvider>
  );
}
