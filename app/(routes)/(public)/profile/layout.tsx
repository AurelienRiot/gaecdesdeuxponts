import type React from "react";
import { ProfilNavBar } from "./nav-components";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative  flex min-h-[80vh] justify-between gap-4 pl-24 pr-4">
      <ProfilNavBar />
      {children}
    </div>
  );
}
