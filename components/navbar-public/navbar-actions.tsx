"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

const NavbarAction = () => {
  return (
    <div className="flex items-center ml-4 gap-x-2 sm:gap-x-4 ">
      <ThemeToggle />
    </div>
  );
};

export default NavbarAction;
