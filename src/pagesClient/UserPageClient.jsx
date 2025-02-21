"use client";

import { activateUser, deactivateUser, getUserById } from "@/actions/CrudUser";
import { CardOverView, PopupFormEditUser, WeeklySchedule } from "@/components";
import { CheckIcon, PencilIcon, UserIcon, XIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCustomToast } from "@/hooks";
import { useCallback, useState } from "react";

export function UserPageClient({ initialData = { error: true }, id }) {
  const [data, setData] = useState(initialData);
  const { data: user, error } = data;
  const [is_open, setIsOpen] = useState(false);

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
        <PopupFormEditUser
          is_open={is_open}
          setIsOpen={setIsOpen}
          data={data?.data}
          handleAction={onGetUser}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl">{user.fullName}</h2>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Card className="flex flex-col gap-3 w-full p-5 h-fit">
            <div className="flex gap-4 items-center">
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={() => setIsOpen(true)}
              >
                <PencilIcon className="h-4 w-4" /> Editar Datos
              </Button>

              {!user.isActive && (
                <Button
                  variant="outline"
                  className="w-[fit-content] border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500 "
                  onClick={async () => {
                    const response = await activateUser(user.id);
                    if (response.success) {
                      onGetUser();
                      toastSuccess({ title: "Usuario activado correctamente" });
                    } else {
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
                  className="w-[fit-content] border-red-400 text-red-500 hover:bg-red-100 hover:text-red-500"
                  onClick={async () => {
                    const response = await deactivateUser(user.id);
                    if (response.success) {
                      onGetUser();
                      toastSuccess({
                        title: "Usuario desactivado correctamente",
                      });
                    } else {
                      toastError({ title: "Error al activar usuario" });
                    }
                  }}
                >
                  Desactivar Usuario
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Nombre completo:</p>
              <p className="sm:text-lg">{user.fullName}</p>
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Rol:</p>
              <p className="sm:text-lg">{user.role[0]}</p>
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Estado:</p>
              <p
                className={`text-lg ${user.isActive ? "text-green-500" : "text-red-500"}`}
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Email:</p>
              <p className="sm:text-lg">{user.email}</p>
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Telefono:</p>
              <p className="sm:text-lg">{user.phoneNumber}</p>
            </div>
            <div className="flex flex-col gap-0 sm:flex-row sm:gap-2 border-b-2 pb-2 border-gray-300">
              <p className="sm:text-lg font-semibold">Pais:</p>
              <p className="sm:text-lg">{user.country}</p>
            </div>
            <div className="flex gap-2">
              <p className="sm:text-lg font-semibold">Ciudad:</p>
              <p className="sm:text-lg">{user.city}</p>
            </div>
          </Card>

          {user.role[0] !== "admin" && <WeeklySchedule userId={user.id}/>}
        </div>
      </div>
    );
  }
}
