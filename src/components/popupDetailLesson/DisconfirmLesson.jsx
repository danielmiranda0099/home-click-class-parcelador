"use client";
import { disconfirmLesson } from "@/actions/lessonDebts";
import { XIcon } from "../icons";
import { Button } from "../ui/button";
import { useState } from "react";
import { DialogDisconfirmLesson } from "./DialogDisconfirmLesson";
import { useLessonsStore } from "@/store/lessonStore";
import { useCustomToast } from "@/hooks";
import { useSearchParams } from "next/navigation";
import { useUiStore } from "@/store/uiStores";

export function DisconfirmLesson({ rol }) {
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
    const response = await disconfirmLesson(
      lesson?.id,
      lesson?.studentLessons[0].studentId
    );
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
      {rol === "admin" &&
        !lesson?.studentLessons[0].isStudentPaid &&
        lesson?.isConfirmed &&
        !lesson.isGroup &&
        !lesson?.isTeacherPaid && (
          <>
            <DialogDisconfirmLesson
              is_open_dialog_disconfirm={is_open_dialog_disconfirm}
              setIsOpenDialogDisconfirm={setIsOpenDialogDisconfirm}
              handleAction={onDisconfirmLesson}
            />
            <Button
              className="flex gap-2"
              onClick={async () => {
                setIsOpenDialogDisconfirm(true);
              }}
            >
              <XIcon size={18} />
              Desconfirmar
            </Button>
          </>
        )}
    </>
  );
}
