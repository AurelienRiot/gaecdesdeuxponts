"use client";
import { Category } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "./user-fetch";
import { UserWithOrdersAndAdress } from "@/types";

type UserContextType = {
  user: UserWithOrdersAndAdress | null;
  setUser: React.Dispatch<React.SetStateAction<UserWithOrdersAndAdress | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserWithOrdersAndAdress | null>(null);
  useEffect(() => {
    const fetchAndSetUser = async () => {
      const data = await fetchUser();
      setUser(data);
    };

    fetchAndSetUser();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}
