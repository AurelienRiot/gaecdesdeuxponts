const getUserName = (user: { name?: string | null; company?: string | null; email?: string | null }) =>
  user.company || user.name || user.email?.split("@")[0] || "";

export { getUserName };
