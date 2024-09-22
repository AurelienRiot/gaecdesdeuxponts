"use client";
import type { GetUserReturnType } from "@/actions/get-user";
import { createContext, useContext, useState } from "react";

type UserContextType = {
  user: GetUserReturnType | null;
  setUser: React.Dispatch<React.SetStateAction<GetUserReturnType | null>>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
  children: React.ReactNode;
  data: GetUserReturnType | null;
}> = ({ children, data }) => {
  const [user, setUser] = useState<GetUserReturnType | null>(data);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
}
