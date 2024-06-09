"use client";
import { UserWithOrdersAndAdress } from "@/types";
import { createContext, useContext, useState } from "react";

type UserContextType = {
  user: UserWithOrdersAndAdress | null;
  setUser: React.Dispatch<React.SetStateAction<UserWithOrdersAndAdress | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  data: UserWithOrdersAndAdress | null;
}> = ({ children, data }) => {
  const [user, setUser] = useState<UserWithOrdersAndAdress | null>(data);
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
