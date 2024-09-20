"use client";
const moment = require("moment");
import { useUiStore } from "@/store/uiStores";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateNewLesson } from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";

export function FormNewUser() {
  const AddNewLesson = useLessonStore((state) => state.AddNewLesson);
  const [studentInfo, setStudentInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  const handleStudentInfoChange = (e) => {
    setStudentInfo({ ...studentInfo, [e.target.id]: e.target.value });
  };

  const is_open = useUiStore((state) => state.popupFormNewUser);
  const setIsOpen = useUiStore((state) => state.setPopupFormNewUser);

  const OnCreateNewStudent = async () => {
    // const lesson = {
    //   teacher: teacher,
    //   teacher_payment: teacher_payment_formated,
    //   students: studentInfo.firstName + " " + studentInfo.lastName,
    //   student_fee: student_fee_formated,
    // };
    // const data = all_date.map((time) => ({
    //   ...lesson,
    //   start_date: time,
    // }));
    // // console.log(data);
    // const new_lesson = await CreateNewLesson(data);
    // AddNewLesson(new_lesson, "admin");
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[900px] ">
        <DialogHeader className="">
          <DialogTitle>New User</DialogTitle>
        </DialogHeader>
        <div className="p-0 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={studentInfo.firstName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={studentInfo.lastName}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={studentInfo.email}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={studentInfo.phone}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={studentInfo.city}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={studentInfo.country}
                onChange={handleStudentInfoChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="">Create New User</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
