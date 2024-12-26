"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateLesson } from "@/actions/CrudLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";

import { students, teachers } from "@/mockData";
import { InputPriceLesson, InputSearch } from "..";
import { FormLessonReview } from "./FormLessonReview";
import { CheckIcon } from "../icons";

export function FormLesson({ rol }) {
  const { popupFormLesson: is_open, setPopupFormLesson: setIsOpen } =
    useUiStore();
  const { selected_lesson, setLessons } = useLessonsStore();

  const [teacher, setTeacher] = useState("");
  const [teacher_payment, setTeacherPayment] = useState("");
  const [student, setStudent] = useState("");
  const [student_fee, setStudentFee] = useState("");

  useEffect(() => {
    if (selected_lesson) {
      console.log("UseEffect Edit formLesson");
      console.log(selected_lesson.students);
      setTeacherPayment(selected_lesson.teacherPayment.toString());
      // setStudentFee(selected_lesson.studentFee.toString());

      setStudent(
        () =>
          students.find((item) => item.label === selected_lesson.students)
            ?.value ?? selected_lesson.students
      );
      setTeacher(
        () =>
          teachers.find((item) => item.label === selected_lesson.teacher)
            ?.value || selected_lesson.teacher
      );
    }
  }, [selected_lesson]);

  const OnSubmit = async (form_data) => {
    const teacher_payment_string = teacher_payment?.replace(/[^0-9]/g, "");
    const teacher_payment_formated = parseInt(teacher_payment_string, 10) || 0;

    const student_fee_string = student_fee?.replace(/[^0-9]/g, "");
    const student_fee_formated = parseInt(student_fee_string, 10) || 0;

    form_data.forEach((value, key) => console.log(key, value));
    if (rol === "admin") {
      if (!form_data.get("is_student_paid") && selected_lesson.isStudentPaid) {
        form_data.append("is_student_paid", "0");
      }
      if (!form_data.get("is_teacher_paid") && selected_lesson.isTeacherPaid) {
        form_data.append("is_teacher_paid", "0");
      }

      form_data.append("teacherPayment", teacher_payment_formated);
      form_data.append("studentFee", student_fee_formated);
      const form_data_object = Object.fromEntries(form_data.entries());
      console.log(form_data_object);

      await updateLesson(selected_lesson.id, form_data);

      setLessons(rol);
    }
    setIsOpen(false);
  };

  return (
    selected_lesson && (
      <Dialog open={is_open} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] pt-0">
          <DialogDescription></DialogDescription>
          <DialogHeader className="p-0">
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <div>
            <form action={OnSubmit} className="grid gap-4">
              <>
                {rol === "admin" && (
                  <>
                    <div className={`grid grid-cols-2 gap-4`}>
                      <div className="grid gap-2">
                        <Label>Price Student</Label>
                        <InputPriceLesson
                          value={student_fee}
                          setValue={setStudentFee}
                        />
                      </div>
                    </div>
                    <div className={`grid grid-cols-2 gap-4`}>
                      <div className="grid gap-2">
                        <Label>Teacher</Label>
                        <InputSearch
                          value={teacher}
                          setValue={setTeacher}
                          data={teachers}
                          placeholder="Select a teacher"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Price Teacher</Label>
                        <InputPriceLesson
                          value={teacher_payment}
                          setValue={setTeacherPayment}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>

              <FormLessonReview lesson={selected_lesson} rol={rol} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <Button type="submit" className="flex gap-2">
                  <CheckIcon size={18} />
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
