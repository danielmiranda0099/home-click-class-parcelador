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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  CreateNewLesson,
  GetLessons,
  RescheduleLesson,
  UpdateLesson,
} from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { FormattedLessonsForCalendar } from "@/utils/formattedLessonsForCalendar";
import { formattedDateForInput } from "@/utils/formattedDateForInput";

import { students, teachers } from "@/mockData";
import { InputPriceLesson, InputSearch } from "..";
import { FormLessonReview } from "./FormLessonReview";

//TODO: Refact this component
// STATE:
//   CREATE
//   EDIT
//   RESCHEDULE
export function FormLesson({ rol }) {
  //TODO: FORMSTATE EN UN OBJETO POR FAVOR
  const popupFormLessonState = useUiStore(
    (state) => state.popupFormLessonState
  );
  const is_open = useUiStore((state) => state.popupFormLesson);
  const setIsOpen = useUiStore((state) => state.setPopupFormLesson);
  const selected_lesson = useLessonStore((state) => state.selected_lesson);
  const SetLessons = useLessonStore((state) => state.SetLessons);

  const [teacher, setTeacher] = useState("");
  const [teacher_payment, setTeacherPayment] = useState("");
  const [student, setStudent] = useState("");
  const [student_fee, setStudentFee] = useState("");

  useEffect(() => {
    if (popupFormLessonState === "EDIT" && selected_lesson) {
      console.log("UseEffect Edit formLesson");
      console.log(selected_lesson.students);
      setTeacherPayment(selected_lesson.teacherPayment.toString());
      setStudentFee(selected_lesson.studentFee.toString());

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
  }, [popupFormLessonState, selected_lesson]);

  const OnSubmit = async (form_data) => {
    const teacher_payment_string = teacher_payment?.replace(/[^0-9]/g, "");
    const teacher_payment_formated = parseInt(teacher_payment_string, 10) || 0;

    const student_fee_string = student_fee?.replace(/[^0-9]/g, "");
    const student_fee_formated = parseInt(student_fee_string, 10) || 0;
    if (popupFormLessonState === "CREATE") {
      form_data.append(
        "teacher",
        teachers.find((item) => item.value === teacher).label
      );
      form_data.append("teacher_payment", teacher_payment_formated);

      form_data.append(
        "students",
        students.find((item) => item.value === student).label
      );
      form_data.append("student_fee", student_fee_formated);

      form_data.forEach((value, key) => console.log(`${key}:  ${value}`));

      const new_lesson = await CreateNewLesson(form_data);
      // AddNewLesson(new_lesson, "admin");
    }
    if (popupFormLessonState === "EDIT") {
      // form_data.append(
      //   "teacher",
      //   teachers.find((item) => item.value === teacher).label
      // );
      form_data.forEach((value, key) => console.log(key, value));
      if (rol === "admin") {
        if (
          !form_data.get("is_student_paid") &&
          selected_lesson.isStudentPaid
        ) {
          form_data.append("is_student_paid", "0");
        }
        if (
          !form_data.get("is_teacher_paid") &&
          selected_lesson.isTeacherPaid
        ) {
          form_data.append("is_teacher_paid", "0");
        }
      }
      form_data.append("teacherPayment", teacher_payment_formated);
      form_data.append("studentFee", student_fee_formated);
      const form_data_object = Object.fromEntries(form_data.entries());
      console.log(form_data_object);

      await UpdateLesson(selected_lesson.id, form_data);

      const data = await GetLessons();
      const lessons = FormattedLessonsForCalendar(data, rol);

      SetLessons(lessons);
    }
    setIsOpen(false);
  };

  return (
    selected_lesson && (
      <Dialog open={is_open} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] pt-0">
          <DialogDescription></DialogDescription>
          <DialogHeader className="p-0">
            <DialogTitle>
              {popupFormLessonState === "CREATE"
                ? "Create New Class"
                : popupFormLessonState === "EDIT"
                  ? "Edit Class"
                  : popupFormLessonState === "RESCHEDULE"
                    ? "Reschedule Class"
                    : "UNKNOWN"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <form action={OnSubmit} className="grid gap-4">
              {popupFormLessonState !== "RESCHEDULE" && (
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

                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-2">
                          <Label>Student Pay</Label>

                          <Switch
                            name="is_student_paid"
                            defaultChecked={
                              popupFormLessonState !== "CREATE"
                                ? selected_lesson?.isStudentPaid
                                : false
                            }
                            value={!selected_lesson?.isStudentPaid ? "1" : "0"}
                          />
                        </div>

                        <div
                          className={`grid gap-2 ${!selected_lesson.isRegistered && " opacity-50 cursor-not-allowed"}`}
                        >
                          <Label>Teacher Pay</Label>

                          <Switch
                            className={` ${!selected_lesson.isRegistered && ""}`}
                            disabled={!selected_lesson.isRegistered}
                            name="is_teacher_paid"
                            defaultChecked={
                              popupFormLessonState !== "CREATE"
                                ? selected_lesson?.isTeacherPaid
                                : false
                            }
                            value={!selected_lesson?.isStudentPaid ? "1" : "0"}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <FormLessonReview
                status={popupFormLessonState}
                lesson={selected_lesson}
                rol={rol}
              />

              {popupFormLessonState !== "EDIT" && (
                <div
                  className={`grid grid-cols-2 gap-4
                  }`}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="datetime-local"
                      defaultValue={
                        popupFormLessonState !== "CREATE"
                          ? formattedDateForInput(selected_lesson?.start)
                          : ""
                      }
                      required
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <Button type="submit">
                  {popupFormLessonState === "CREATE"
                    ? "Create"
                    : popupFormLessonState === "EDIT"
                      ? "Edit"
                      : popupFormLessonState === "RESCHEDULE"
                        ? "Reschedule"
                        : "UNKNOWN"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
