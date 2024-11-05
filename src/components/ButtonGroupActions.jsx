"use client";

import { useUiStore } from "@/store/uiStores";
import { Button } from "./ui/button";
import { PlusCircleIcon, UserIcon } from "./icons";

export function ButtonGroupActions() {
  const setPopupFormNewUser = useUiStore((state) => state.setPopupFormNewUser);

  const setPopupFormCreateNewLesson = useUiStore(
    (state) => state.setPopupFormCreateNewLesson
  );

  return (
    <div className="p-4 flex flex-col gap-2">
      <Button
        className="w-full justify-start space-x-2"
        onClick={() => {
          setPopupFormNewUser(true);
        }}
      >
        <UserIcon />
        <span>New User</span>
      </Button>

      <Button
        className="w-full justify-start space-x-2"
        onClick={() => {
          setPopupFormCreateNewLesson(true);
        }}
      >
        <PlusCircleIcon />
        <span>New Class</span>
      </Button>
    </div>
  );
}
