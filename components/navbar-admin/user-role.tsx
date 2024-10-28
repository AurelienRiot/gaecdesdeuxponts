import { getSessionUser } from "@/actions/get-user";

async function UserRole() {
  const user = await getSessionUser();
  if (!user) {
    return "Non connecté";
  }
  switch (user.role) {
    case "admin":
      return "Admin";
    case "readOnlyAdmin":
      return "Admin lecture seule";
    case "pro":
      return "Profesionnel";
    case "user":
      return "Utilisateur";
    case "shipping":
      return "Livraison";
  }
}

export default UserRole;
