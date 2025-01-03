import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./_components/client";
import  type { CategoryColumnType } from "./_components/columns";

export const dynamic = "force-dynamic";

const CategoriesPage = async () => {
  const categories = await prismadb.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumnType[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl,
    type: "categories",
    createdAt: item.createdAt,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
