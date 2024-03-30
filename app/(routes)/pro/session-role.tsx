"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const SessionRole = () => {
  const { update, data } = useSession();
  useEffect(() => {
    if (data?.user?.role !== "pro") {
      update({ role: "pro" }).catch(console.error);
    }
  }, [data, update]);
  return null;
};

export default SessionRole;
