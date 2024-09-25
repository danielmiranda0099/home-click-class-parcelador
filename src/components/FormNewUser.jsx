"use client";

import { useUiStore } from "@/store/uiStores";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateNewUser } from "@/actions/CrudUser";

const DEFAULT_DATA_USER = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  country: "",
  role: "",
};

export function FormNewUser() {
  const [userInfo, setUserInfo] = useState(DEFAULT_DATA_USER);

  const handleStudentInfoChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setUserInfo({ ...userInfo, role: value });
  };

  const is_open = useUiStore((state) => state.popupFormNewUser);
  const setIsOpen = useUiStore((state) => state.setPopupFormNewUser);

  const OnCreateNewUser = async () => {
    //TODO: Verificar que todo este
    if (userInfo.role.length <= 0) return;

    await CreateNewUser(userInfo);
    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
        </DialogHeader>
        <div className="p-0 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <RadioGroup
              className="flex space-x-4"
              value={userInfo.role}
              onValueChange={handleRoleChange}
            >
              <div className="flex items-center">
                <RadioGroupItem value="student" id="r1" className="sr-only" />
                <Label
                  htmlFor="r1"
                  className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
                    ${userInfo.role === "student" && "bg-blue-400 text-white"}`}
                >
                  Student
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem
                  value="teacher"
                  id="r2"
                  className="sr-only peer"
                />
                <Label
                  htmlFor="r2"
                  className={`flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer 
                    ${userInfo.role === "teacher" && "bg-blue-400 text-white"}`}
                >
                  Teacher
                </Label>
              </div>
            </RadioGroup>
            <div></div>
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
          </div>
          <div className="flex justify-end">
            <Button onClick={OnCreateNewUser}>Create New User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
