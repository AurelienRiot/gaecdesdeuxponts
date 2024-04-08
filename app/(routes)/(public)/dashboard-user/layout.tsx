import { checkPro } from "@/components/auth/checkAuth";
import { CategoriesProvider } from "@/context/categories-context";
import { ProductsProvider } from "@/context/products-context";
import { UserProvider } from "@/context/user-context";
import { redirect } from "next/navigation";
import React from "react";

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
          <div className="relative h-full ">{children}</div>{" "}
        </ProductsProvider>
      </CategoriesProvider>
    </UserProvider>
  );
}
