"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useUiStore } from "@/store/uiStores";
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

import { createNewUser } from "@/actions/CrudUser";
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

const DEFAULT_DATA_USER = {
  firstName: "",
  lastName: "",
  email: "",
  personalEmail: "",
  phoneNumber: "",
  city: "",
  country: "",
  role: "",
  password: generatePassword(),
};

function SubmitButton({ is_copied_credentials }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || !is_copied_credentials}>
      {pending ? "Registering New User..." : "Register New User"}
    </Button>
  );
}

export function FormRegisterUser() {
  const [userInfo, setUserInfo] = useState(DEFAULT_DATA_USER);
  const [form_state, dispath] = useFormState(createNewUser, {
    data: [],
    success: null,
    error: false,
    message: null,
  });
  const [is_copied_credentials, setIsCopiedCredentials] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const { users, setUsers } = useUserStore();
  const { popupFormNewUser: is_open, setPopupFormNewUser: setIsOpen } =
    useUiStore();
  const { toastSuccess } = useCustomToast();

  useEffect(() => {
    if (form_state.success) {
      setUsers();
      setUserInfo(DEFAULT_DATA_USER);
      toastSuccess({ title: "Usuario creado exitosamente" });
      setIsOpen(false);
    }
    if (form_state.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state, setIsOpen]);

  useEffect(() => {
    setUsers();
  }, []);

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
    setIsCopiedCredentials(true);
  };

  const OnCreateNewUser = async () => {
    dispath(userInfo);
    setErrorMessage("");
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] overflow-y-scroll max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-left">New User</DialogTitle>
        </DialogHeader>
        <form className="p-0 px-4" action={OnCreateNewUser}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={userInfo.firstName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={userInfo.lastName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalEmail">Personal Email</Label>
              <Input
                id="personalEmail"
                type="email"
                value={userInfo.personalEmail}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={userInfo.phoneNumber}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={userInfo.city}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={userInfo.country}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select onValueChange={handleRoleChange} required>
                <SelectTrigger className="" id="role">
                  <SelectValue
                    defaultValue="student"
                    onChange={handleStudentInfoChange}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-1">
                <Input
                  id="password"
                  value={userInfo.password}
                  onChange={handleStudentInfoChange}
                  required
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleGeneratePassword()}
                >
                  <RepeatIcon />
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => copyToClipboard()}
                  disabled={!userInfo.email}
                >
                  Copy
                </Button>
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
              <SubmitButton is_copied_credentials={is_copied_credentials} />
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
