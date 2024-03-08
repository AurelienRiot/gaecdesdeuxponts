import prismadb from "@/lib/prismadb";
import { ContactClient } from "./components/client";
import { ContactColumn } from "./components/columns";

const ContactsPage = async () => {
  const contacts = await prismadb.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedContacts: ContactColumn[] = contacts.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone === null ? undefined : item.phone,
    mail: item.mail,
    subject: item.subject,
    message: item.message,
    createdAt: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <ContactClient data={formattedContacts} />
      </div>
    </div>
  );
};

export default ContactsPage;
