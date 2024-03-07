import { MainNav } from "@/components/navbar-admin/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import MobileNav from "./mobile-nav";
import { LogoutButton } from "@/components/auth/auth-button";

const Navbar = async () => {
  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <MainNav className=" hidden lg:block pl-8" />
        <MobileNav className="mx-6 lg:hidden" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
