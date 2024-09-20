"use client";

import { useUiStore } from "@/store/uiStores";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "./icons";

export function ButtonGroupActions() {
  const setPopupFormNewUser = useUiStore((state) => state.setPopupFormNewUser);

  const setPopupFormNewLesson = useUiStore(
    (state) => state.setPopupFormNewLesson
  );

  return (
    <div className="p-4 flex flex-col gap-2">
      <Button
        className="w-full justify-start space-x-2"
        onClick={() => {
          setPopupFormNewUser(true);
        }}
      >
        <PlusCircleIcon />
        <span>New User</span>
      </Button>

      <Button
        className="w-full justify-start space-x-2"
        onClick={() => {
          setPopupFormNewLesson(true);
        }}
      >
        <PlusCircleIcon />
        <span>New Class</span>
      </Button>
    </div>
  );
}
