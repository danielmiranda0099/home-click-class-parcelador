"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
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
import { updateLesson } from "@/actions/CrudLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useUiStore } from "@/store/uiStores";
import { FormLessonReview } from "./FormLessonReview";
import { CheckIcon } from "../icons";
import { FormFieldStudents } from "../PopupFormCreateNewLesson/FormFieldStudents";
import { DATA_LESSON_DEFAULT } from "@/utils/constans";
import { FormFieldTeacher } from "../PopupFormCreateNewLesson/FormFieldTeacher";
import { ErrorAlert } from "@/components";
import { useCustomToast } from "@/hooks";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="flex gap-2" disabled={pending}>
      <CheckIcon size={18} />
      Guardar
    </Button>
  );
}

export function FormLesson({ rol }) {
  const { popupFormLesson: is_open, setPopupFormLesson: setIsOpen } =
    useUiStore();
  const { selected_lesson, setLessons } = useLessonsStore();
  console.log("selected lesson", selected_lesson);

  const [data_lesson, setDataLesson] = useState(DATA_LESSON_DEFAULT);

  const [form_state, dispath] = useFormState(updateLesson, {
    data: [],
    succes: null,
    error: false,
    message: null,
  });
  const [error_message, setErrorMessage] = useState("");
  const { toastSuccess } = useCustomToast();

  useEffect(() => {
    if (selected_lesson && is_open) {
      setDataLesson({
        ...data_lesson,
        students: selected_lesson?.studentLessons?.map((student_lesson) => ({
          fee: student_lesson.studentFee,
          student: {
            ...student_lesson.student,
            value:
              student_lesson.student.firstName +
              "-" +
              student_lesson.student.lastName,
            label:
              student_lesson.student.firstName +
              " " +
              student_lesson.student.lastName,
          },
          isPay: student_lesson.isStudentPaid,
          isConfirmed: student_lesson.isConfirmed,
          disabled: true
        })),
        teacher: {
          payment: selected_lesson?.teacherPayment,
          teacher: {
            ...selected_lesson?.teacher,
            value:
              selected_lesson?.teacher.firstName +
              "-" +
              selected_lesson?.teacher.lastName,
            label:
              selected_lesson?.teacher.firstName +
              " " +
              selected_lesson?.teacher.lastName,
          },
          isPay: selected_lesson?.isTeacherPaid,
        },
        isRegistered: selected_lesson?.isRegistered,
      });
    }
  }, [selected_lesson, is_open]);

  useEffect(() => {
    console.log(form_state);
    if (form_state?.success) {
      toastSuccess({ title: "Clase editada." });
      // setLessons("admin");
      // setIsOpen(false);
    }
    if (form_state?.error) {
      setErrorMessage(form_state.message);
    } else {
      setErrorMessage("");
    }
  }, [form_state]);

  const onSubmit = async (form_data) => {
    console.log("data_lesson", data_lesson);
    console.log("form_data");
    form_data.forEach((value, key) => console.log(key, ":", value));
    const form_data_object = Object.fromEntries(form_data.entries());
    const data = {
      students: data_lesson.students,
      teacher: data_lesson.teacher,
      ...form_data_object,
      lessonId: selected_lesson?.id,
    };
    console.log("data", data);
    setErrorMessage("");
    dispath(data);
  };

  return (
    selected_lesson && (
      <Dialog
        open={is_open}
        onOpenChange={(open) => {
          if (!open) {
            setErrorMessage("");
          }
          setIsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[700px] pt-0">
          <DialogDescription></DialogDescription>
          <DialogHeader className="p-0">
            <DialogTitle>Edit Class</DialogTitle>
          </DialogHeader>
          <div>
            <form action={onSubmit} className="grid gap-4">
              <>
                <FormFieldStudents
                  data_lesson={data_lesson}
                  setDataLesson={setDataLesson}
                />
                {!selected_lesson?.isTeacherPaid && (
                  <FormFieldTeacher
                    data_lesson={data_lesson}
                    setDataLesson={setDataLesson}
                  />
                )}
              </>

              <FormLessonReview lesson={selected_lesson} rol={rol} />

              <ErrorAlert message={error_message} />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <SubmitButton />
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
