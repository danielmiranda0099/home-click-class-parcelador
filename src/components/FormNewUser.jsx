"use client";

import { useUiStore } from "@/store/uiStores";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CreateNewUser } from "@/actions/CrudUser";
import { useUserStore } from "@/store/userStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RepeatIcon } from "./icons";
import { generatePassword } from "@/utils/generatePassword";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "./ui/toast";

const DEFAULT_DATA_USER = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  country: "",
  role: "",
  password: generatePassword(),
};

export function FormNewUser() {
  const { addNewUser } = useUserStore();
  const [userInfo, setUserInfo] = useState(DEFAULT_DATA_USER);
  const { toast } = useToast();

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
        toast({
          title: "Credenciales Copiadas",
          variant: "success",
          duration: 12000,
          description: (
            <p className="font-medium">
              Correo: {userInfo.email} Password: {userInfo.password}
            </p>
          ),
          action: (
            <ToastAction
              altText="Goto schedule to undo"
              className="bg-green-500 text-white border-green-500 hover:text-white hover:bg-green-500"
            >
              Cerrar
            </ToastAction>
          ),
        });
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const is_open = useUiStore((state) => state.popupFormNewUser);
  const setIsOpen = useUiStore((state) => state.setPopupFormNewUser);

  const OnCreateNewUser = async () => {
    //TODO: Verificar que todo este
    // if (userInfo.role.length <= 0) return;

    // const user = await CreateNewUser(userInfo);
    // addNewUser(user);
    setUserInfo(DEFAULT_DATA_USER);
    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
        </DialogHeader>
        <form className="p-0 px-4" action={OnCreateNewUser}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
              <Label htmlFor="rol">Rol</Label>
              <Select onValueChange={handleRoleChange} required>
                <SelectTrigger className="" id="rol">
                  <SelectValue defaultValue="student" />
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
                >
                  Copy
                </Button>
              </div>
            </div>
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
              <Button type="submit">Create New User</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
