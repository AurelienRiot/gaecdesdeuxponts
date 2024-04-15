import prismadb from "@/lib/prismadb";
import { ContactClient } from "./_components/client";
import { ContactColumn } from "./_components/columns";

export const dynamic = "force-dynamic";

const ContactsPage = async () => {
  const contacts = await prismadb.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedContacts: ContactColumn[] = contacts.map((item) => ({
    id: item.id,
    userId: item.userId,
    name: item.name,
    phone: item.phone === null ? "" : item.phone,
    email: item.email,
    subject: item.subject,
    text: item.message,
    createdAt: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ContactClient data={formattedContacts} />
      </div>
    </div>
  );
};

export default ContactsPage;
