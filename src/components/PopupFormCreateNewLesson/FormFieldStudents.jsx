"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircleIcon, XIcon } from "@/components/icons";
import { InputSearch } from "@/components/InputSearch";
import { InputPriceLesson } from "@/components/InputPriceLesson";
import { useUserStore } from "@/store/userStore";
import { formatUsersForInputSearch } from "@/utils/formatUsersForInputSearch";
import { useLessonsStore } from "@/store/lessonStore";

export function FormFieldStudents({ data_lesson, setDataLesson }) {
  const [students_for_input_search, setStudentsForInputSearh] = useState([]);
  const { users } = useUserStore();

  useEffect(() => {
    if (users?.length > 0) {
      const students_formated = formatUsersForInputSearch(users, "student");
      setStudentsForInputSearh(students_formated);
    }
  }, [users]);

  const updateStudentData = (index, field, value) => {
    const newStudentsData = [...data_lesson.students];
    newStudentsData[index][field] = value;
    setDataLesson({ ...data_lesson, students: newStudentsData });
  };

  const addNewStudent = () => {
    setDataLesson({
      ...data_lesson,
      students: [...data_lesson.students, { student: null, fee: "" }],
    });
  };

  const handlerRemoveStudent = (index_student) => {
    const student_filtered = data_lesson.students.filter(
      (student, index) => index !== index_student
    );
    setDataLesson({
      ...data_lesson,
      students: student_filtered,
    });
  };

  return (
    <>
      {data_lesson.students.map((studentData, index) => (
        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          <div className="grid gap-2 overflow-hidden">
            <Label>Student</Label>
            <InputSearch
              value={studentData.student}
              setValue={(value) => updateStudentData(index, "student", value)}
              data={students_for_input_search}
              placeholder="Select a student"
              disabled={studentData?.disabled}
            />
          </div>
          <div className="grid gap-2">
            <Label>Price Student Per Hour</Label>
            <InputPriceLesson
              value={studentData.fee}
              setValue={(value) => updateStudentData(index, "fee", value)}
              disabled={studentData?.isPay}
            />
          </div>

          {!studentData?.isConfirmed && !studentData?.isPay && (
            <div
              className="bg-white rounded-full shadow-xl border border-gray-300 p-2 absolute right-0 cursor-pointer hover:bg-gray-200"
              onClick={() => handlerRemoveStudent(index)}
            >
              <XIcon />
            </div>
          )}
        </div>
      ))}

      <div className="flex items-center">
        <Button
          variant="outline"
          className="flex gap-2"
          type="button"
          onClick={addNewStudent}
        >
          Nuevo Etudiante
          <PlusCircleIcon />
        </Button>
      </div>
    </>
  );
}
