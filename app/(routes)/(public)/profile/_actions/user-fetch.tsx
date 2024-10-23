"use server";
import GetUser from "@/actions/get-user";

export const fetchUser = async () => {
  return await GetUser();
};
