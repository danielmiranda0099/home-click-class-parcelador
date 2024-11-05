"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { InputSearch } from "@/components/InputSearch";
import { InputPriceLesson } from "@/components/InputPriceLesson";
import { useUserStore } from "@/store/userStore";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";

export function FormFieldTeacher({ data_lesson, setDataLesson }) {
  const [teachers_for_input_search, setTeachersForInputSearh] = useState([]);
  const { users } = useUserStore();
  //TODO: eliminar useeffect o que se actulice los inputs cuando se crea un user sin necesitar del useeffects o pasarlo a un CUSTOM HOOK
  useEffect(() => {
    const teachers_formated = formatUsersForInputSearch(users, "teacher");
    setTeachersForInputSearh(teachers_formated);
  }, [users]);
  return (
    <div className={`grid grid-cols-2 gap-4`}>
      <div className="grid gap-2">
        <Label>Teacher</Label>
        <InputSearch
          value={data_lesson.teacher.teacher}
          setValue={(value) =>
            setDataLesson({
              ...data_lesson,
              teacher: { ...data_lesson.teacher, teacher: value },
            })
          }
          data={teachers_for_input_search}
          placeholder="Select a teacher"
        />
      </div>
      <div className="grid gap-2">
        <Label>Price Teacher</Label>
        <InputPriceLesson
          value={data_lesson.teacher.payment}
          setValue={(value) =>
            setDataLesson({
              ...data_lesson,
              teacher: { ...data_lesson.teacher, payment: value },
            })
          }
        />
      </div>
    </div>
  );
}
