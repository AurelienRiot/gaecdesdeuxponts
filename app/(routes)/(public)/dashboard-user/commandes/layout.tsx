import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commandes",
};

function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export default Layout;