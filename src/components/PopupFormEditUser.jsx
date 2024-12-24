"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createNewUser, updateUser } from "@/actions/CrudUser";
import { useUserStore } from "@/store/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepeatIcon } from "@/components/icons";
import { generatePassword } from "@/utils/generatePassword";
import { ErrorAlert } from "@/components/";
import { useCustomToast } from "@/hooks";
import { Checkbox } from "./ui/checkbox";


function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending}>
      Editar usuario
    </Button>
  );
}

export function PopupFormEditUser({ is_open, setIsOpen, data, handleAction }) {
  const DEFAULT_DATA_USER = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNumber: data?.phoneNumber || "",
    city: data?.city || "",
    country: data?.country || "",
    role: data?.role[0] || "",
    password: "",
    idUser: data?.id,
  };
  const [userInfo, setUserInfo] = useState(DEFAULT_DATA_USER);
  const [is_change_password, setIsChangePassword] = useState(false);
  const [form_state, dispath] = useFormState(updateUser, {
    data: [],
    success: null,
    error: false,
    message: null,
  });

  const [error_message, setErrorMessage] = useState("");
  const { setUsers } = useUserStore();
  const { toastSuccess } = useCustomToast();

  useEffect(() => {
    setErrorMessage("");
    if (form_state.success) {
      setUsers();
      setUserInfo(DEFAULT_DATA_USER);
      toastSuccess({ title: "Usuario creado exitosamente" });
      setIsOpen(false);
    }
    if (form_state.error) {
      setErrorMessage(form_state.message);
    } 
  }, [form_state, setIsOpen]);

  const handleStudentInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setUserInfo({ ...userInfo, role: value });
  };

  const handleGeneratePassword = () => {
    setUserInfo({ ...userInfo, password: generatePassword() });
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`Correo: ${userInfo.email} Password: ${userInfo.password}`)
      .then(() => {
        toastSuccess({
          title: "Credenciales copiadas",
        });
      });
  };

  const OnCreateNewUser = async () => {
    dispath(userInfo);
    setErrorMessage("");
    handleAction();
  };

  return (
    <Dialog
      open={is_open}
      onOpenChange={(open) => {
        if (!open) {
          setErrorMessage("");
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <form className="p-0 px-4" action={OnCreateNewUser}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                defaultValue={data?.firstName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                defaultValue={data?.lastName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={data?.email}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                defaultValue={data?.phoneNumber}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                defaultValue={data?.city}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                defaultValue={data?.country}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <Label htmlFor="role">Rol</Label>
              <Select
                onValueChange={handleRoleChange}
                defaultValue={data?.role[0]}
                required
              >
                <SelectTrigger className="" id="role">
                  <SelectValue onChange={handleStudentInfoChange} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Cambiar contraseña</Label>
                <Checkbox
                  checked={is_change_password}
                  onCheckedChange={() =>
                    setIsChangePassword(!is_change_password)
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-1">
                  <Input
                    id="password"
                    value={userInfo.password}
                    onChange={handleStudentInfoChange}
                    required
                    disabled={!is_change_password}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleGeneratePassword()}
                    disabled={!is_change_password}
                  >
                    <RepeatIcon />
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => copyToClipboard()}
                    disabled={!is_change_password}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <ErrorAlert message={error_message} />
          </div>
          <DialogFooter>
            <div className="space-x-4 flex justify-end">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setUserInfo(DEFAULT_DATA_USER)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <SubmitButton />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
