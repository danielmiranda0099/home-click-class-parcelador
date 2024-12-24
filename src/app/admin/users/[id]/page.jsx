import { getUserById } from "@/actions/CrudUser";
import { UserPageClient } from "@/pagesClient";

export default async function UserPage({ params: { id } }) {
  const data = await getUserById(id);

  return <UserPageClient initialData={data} id={id} />;
}
