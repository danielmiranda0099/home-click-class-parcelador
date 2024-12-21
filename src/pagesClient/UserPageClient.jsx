"use client";

import { activateUser, deactivateUser, getUserById } from "@/actions/CrudUser";
import { CardOverView } from "@/components";
import { CheckIcon, UserIcon, XIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks";
import { useCallback, useEffect, useState } from "react";

export function UserPageClient({ initialData = { error: true }, id }) {
  const [data, setData] = useState(initialData);
  const { data: user, error } = data;

  const { toastSuccess, toastError } = useCustomToast();

  const onGetUser = useCallback(async () => {
    const { data, error } = await getUserById(id);
    if (error) {
      setData({ error: true });
    } else {
      setData({ data });
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-8 container mx-auto p-4 max-w-[1200px]">
        <UserIcon size={"4.4rem"} />
        <p className="text-3xl font-bold">El Usuario No Existe.</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col gap-8 container mx-auto p-4 max-w-[1200px]">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl">{user.fullName}</h2>
          <div className="flex gap-2">
            <Badge className="text-lg flex gap-1">
              <UserIcon size={"1.2rem"} /> {user.role[0]}
            </Badge>
            {user.isActive ? (
              <Badge className="text-lg" variant="outlineSucess">
                <CheckIcon size={"1.2rem"} />
                Activo
              </Badge>
            ) : (
              <Badge className="text-lg" variant="outlineError">
                <XIcon size={"1.2rem"} />
                Inactivo
              </Badge>
            )}
          </div>
        </div>

        {user.role[0] !== "admin" && (
          <CardOverView role={user.role[0]} id={user.id} />
        )}

        <Card className="flex flex-col gap-3 w-[fit-content] p-5">
          <p className="text-2xl font-bold">Datos del usuario</p>
          <div className="flex gap-2 border-b-2 pb-2 border-gray-300">
            <p className="text-lg font-semibold">Email:</p>
            <p className="text-lg">{user.email}</p>
          </div>
          <div className="flex gap-2 border-b-2 pb-2 border-gray-300">
            <p className="text-lg font-semibold">Telefono:</p>
            <p className="text-lg">{user.phoneNumber}</p>
          </div>
          <div className="flex gap-2 border-b-2 pb-2 border-gray-300">
            <p className="text-lg font-semibold">Pais:</p>
            <p className="text-lg">{user.country}</p>
          </div>
          <div className="flex gap-2">
            <p className="text-lg font-semibold">Ciudad:</p>
            <p className="text-lg">{user.city}</p>
          </div>
        </Card>

        {!user.isActive && (
          <Button
            variant="outline"
            className="text-lg w-[fit-content] border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
            onClick={async () => {
              const response = await activateUser(user.id);
              if (response.success) {
                onGetUser();
                toastSuccess({ title: "Usuario activado correctamente" });
              }else{
                toastError({ title: "Error al activar usuario" });
              }
            }}
          >
            Activar Usuario
          </Button>
        )}

        {user.isActive && (
          <Button
            variant="outline"
            className="text-lg w-[fit-content] border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
            onClick={async () => {
              const response = await deactivateUser(user.id);
              if (response.success) {
                onGetUser();
                toastSuccess({ title: "Usuario desactivado correctamente" });
              }else{
                toastError({ title: "Error al activar usuario" });
              }
            }}
          >
            Desactivar Usuario
          </Button>
        )}
      </div>
    );
  }
}
