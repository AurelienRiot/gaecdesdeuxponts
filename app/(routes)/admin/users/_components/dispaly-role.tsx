function DisplayRole({ user }: { user: { role: string; completed: boolean } }) {
  const role = !user.completed
    ? { label: "Incomplet", color: "text-destructive" }
    : user.role === "pro"
      ? { label: "Professionnel", color: "text-green-500" }
      : user.role === "user"
        ? { label: "Particulier", color: "text-blue-500" }
        : { label: "Suivie seulement", color: "text-purple-500" };
  return <p className={role.color}>{role.label}</p>;
}

export default DisplayRole;
