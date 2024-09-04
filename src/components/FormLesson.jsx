"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CreateNewLesson,
  GetLessons,
  RescheduleLesson,
  UpdateLesson,
} from "@/actions/CrudLesson";
import { useLessonStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { FormattedLessons } from "@/utils/formattedLessons";
import { formattedDateForInput } from "@/utils/formattedDateForInput";
import { InputSearch } from ".";
import { InputPriceLesson } from "./InputPriceLesson";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { students, teachers } from "@/mockData";

// STATE:
//   CREATE
//   EDIT
//   RESCHEDULE
export function FormLesson({ rol }) {
  const AddNewLesson = useLessonStore((state) => state.AddNewLesson);
  //TODO FORMSTATE EN UN OBJETO POR FAVOR
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
    console.log("UseEffect");
    if (popupFormLessonState === "EDIT" && selected_lesson) {
      console.log("UseEffect entre al if");
      setTeacherPayment(selected_lesson.teacher_payment.toString());
      setStudentFee(selected_lesson.student_fee.toString());

      setStudent(
        () =>
          students.find((item) => item.label === selected_lesson.students).value
      );
      setTeacher(
        () =>
          teachers.find((item) => item.label === selected_lesson.teacher).value
      );
    }
  }, [popupFormLessonState, selected_lesson]);

  const OnSubmit = async (form_data) => {
    if (popupFormLessonState === "CREATE") {
      const teacher_payment_string = teacher_payment.replace(/[^0-9]/g, "");
      const teacher_payment_formated = parseInt(teacher_payment_string, 10);

      const student_fee_string = student_fee.replace(/[^0-9]/g, "");
      const student_fee_formated = parseInt(student_fee_string, 10);

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
      AddNewLesson(new_lesson, "admin");
    }
    if (popupFormLessonState === "EDIT") {
      form_data.append(
        "students",
        students.find((item) => item.value === student).label
      );
      form_data.append(
        "teacher",
        teachers.find((item) => item.value === teacher).label
      );
      await UpdateLesson(selected_lesson.id, form_data);

      const data = await GetLessons();
      const lessons = FormattedLessons(data, rol);

      SetLessons(lessons);
      const formDataObject = Object.fromEntries(form_data.entries());
      console.log(formDataObject);
    }
    if (popupFormLessonState === "RESCHEDULE") {
      const new_date = {
        id: selected_lesson?.id,
        start_date: form_data.get("start_date"),
      };
      console.log("RESCHEDULE", new_date);
      await RescheduleLesson(new_date);

      const data = await GetLessons();
      const lessons = FormattedLessons(data, rol);

      SetLessons(lessons);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogDescription></DialogDescription>
        <DialogHeader>
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
                        <Label>Teacher</Label>
                        <InputSearch
                          value={teacher}
                          setValue={setTeacher}
                          data={teachers}
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

                    <div className={`grid grid-cols-2 gap-4`}>
                      <div className="grid gap-2">
                        <Label>Student</Label>
                        <InputSearch
                          value={student}
                          setValue={setStudent}
                          data={students}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Price Student</Label>
                        <InputPriceLesson
                          value={student_fee}
                          setValue={setStudentFee}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Student Pay</Label>
                      <Switch
                        name="is_student_paid"
                        defaultChecked={
                          popupFormLessonState !== "CREATE"
                            ? selected_lesson?.is_student_paid
                            : ""
                        }
                      />
                    </div>
                  </>
                )}
                {rol === "teacher" && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="url_teams">Teams Link</Label>
                      <Input
                        name="url_teams"
                        id="url_teams"
                        type="url"
                        placeholder="Enter Teams link"
                        defaultValue={
                          popupFormLessonState !== "CREATE"
                            ? selected_lesson?.url_teams
                            : ""
                        }
                      />
                    </div>
                    <div
                      className={`grid gap-2 ${
                        popupFormLessonState === "RESCHEDULE"
                          ? "pointer-events-none opacity-30"
                          : ""
                      }`}
                    >
                      <Label htmlFor="topic">Class Topic</Label>
                      <Textarea
                        id="topic"
                        name="topic"
                        placeholder="Enter class topic"
                        defaultValue={
                          popupFormLessonState !== "CREATE"
                            ? selected_lesson.topic
                            : ""
                        }
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

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

            {rol === "teacher" && (
              <div className={`grid gap-2`}>
                <Label htmlFor="teacher_observations">Observation Class</Label>
                <Textarea
                  id="teacher_observations"
                  name="teacher_observations"
                  placeholder="Enter Observation Class"
                  defaultValue={
                    popupFormLessonState !== "CREATE"
                      ? selected_lesson?.teacher_observations
                      : ""
                  }
                />
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
  );
}
