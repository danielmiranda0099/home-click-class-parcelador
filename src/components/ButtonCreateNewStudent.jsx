"use client";

import { useUiStore } from "@/store/uiStores";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "./icons";

export function ButtonCreateNewStudent() {
  const setPopupFormNewStudent = useUiStore(
    (state) => state.setPopupFormNewStudent
  );

  return (
    <Button
      className="w-full justify-start space-x-2"
      onClick={() => {
        setPopupFormNewStudent(true);
        console.log("New student");
      }}
    >
      <PlusCircleIcon />
      <span>New Student</span>
    </Button>
  );
}
