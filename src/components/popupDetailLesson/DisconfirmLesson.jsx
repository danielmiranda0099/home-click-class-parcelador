"use client";
import { disconfirmLesson } from "@/actions/lessonDebts";
import { ChevronDown, XIcon } from "../icons";
import { Button } from "../ui/button";
import { useState } from "react";
import { DialogDisconfirmLesson } from "./DialogDisconfirmLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useCustomToast } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useUiStore } from "@/store/uiStores";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function DisconfirmLesson({ rol }) {
  const [user_id, setUserId] = useState(null);
  const [is_open_dialog_disconfirm, setIsOpenDialogDisconfirm] =
    useState(false);
  const { selected_lesson: lesson, setLessons } = useLessonsStore();
  const { setPopupDetailLesson } = useUiStore();
  const { toastSuccess, toastError } = useCustomToast();
  const searchParams = useSearchParams();

  //TODO: getDataRangeFromUrl should be moved to a utility function or hook
  const getDateRangeFromUrl = () => {
    return {
      startOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")) - 1,
        1
      ),
      endOfMonth: new Date(
        parseInt(searchParams.get("year")),
        parseInt(searchParams.get("month")),
        0
      ),
    };
  };

  const onDisconfirmLesson = async () => {
    const response = await disconfirmLesson(lesson?.id, user_id);
    if (response.success) {
      toastSuccess({ title: "Clase Desconfirmada." });
      setPopupDetailLesson(false);
      setLessons(getDateRangeFromUrl(), true);
    } else {
      toastError({ title: "Al parecer hubo un error." });
    }
  };

  return (
    <>
      {rol === "admin" && (
        <DialogDisconfirmLesson
          is_open_dialog_disconfirm={is_open_dialog_disconfirm}
          setIsOpenDialogDisconfirm={setIsOpenDialogDisconfirm}
          handleAction={onDisconfirmLesson}
        />
      )}
      {rol === "admin" &&
        !lesson?.studentLessons[0].isStudentPaid &&
        lesson?.isConfirmed &&
        !lesson.isGroup &&
        !lesson?.isTeacherPaid && (
          <Button
            className="flex gap-2"
            onClick={() => {
              setUserId(lesson?.studentLessons[0].studentId);
              setIsOpenDialogDisconfirm(true);
            }}
          >
            <XIcon size={18} />
            Desconfirmar
          </Button>
        )}

      {rol === "admin" &&
        lesson.isGroup &&
        lesson?.studentLessons?.every( (student_lesson) => !student_lesson.isStudentPaid) &&
        lesson?.studentLessons?.some(
          (student_lesson) => student_lesson.isConfirmed === true
        ) && (
          <div className="flex flex-col items-start sm:items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex gap-2 w-full">
                  <ChevronDown size={18} />
                  Desconfirmar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {lesson?.studentLessons.map(
                  (student_lesson) =>
                    student_lesson.isConfirmed && (
                      <DropdownMenuItem
                        key={student_lesson.id}
                        onClick={async () => {
                          setUserId(student_lesson.studentId);
                          setIsOpenDialogDisconfirm(true);
                        }}
                      >
                        {student_lesson.student.shortName}
                      </DropdownMenuItem>
                    )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
    </>
  );
}
