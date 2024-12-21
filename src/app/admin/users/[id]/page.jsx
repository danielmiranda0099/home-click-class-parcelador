import { getUserById } from "@/actions/CrudUser";
import { CardOverView } from "@/components";
import { CheckIcon, UserIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPageClient } from "@/pagesClient";
import { User } from "lucide-react";

export default async function UserPage({ params: { id } }) {
  const data  = await getUserById(id);

  return <UserPageClient initialData={data} id={id} />;
}
