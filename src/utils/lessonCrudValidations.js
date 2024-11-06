import { DAYS_OF_WEEK } from "@/utils/constans";
import { isValidDate } from "@/utils/dateValidator";
import { validateScheduleTimes } from "@/utils/validateScheduleTimes";

export function validateStudents(students) {
  const hasInvalidStudent = students.some(
    (student) => !student.student || !student.fee
  );

  if (hasInvalidStudent) {
    return {
      isValid: false,
      error: "Complete los campos del estudiante.",
    };
  }

  return { isValid: true };
}
export function validateTeacher(teacher) {
  if (!teacher.teacher || !teacher.payment) {
    return {
      isValid: false,
      error: "Complete los campos del profesor.",
    };
  }
  return { isValid: true };
}

export function validatePeriodOfTime(periodOfTime) {
  if (!periodOfTime) {
    return {
      isValid: false,
      error: "Complete el campo de periodo de tiempo.",
    };
  }
  return { isValid: true };
}

export function validateStartDate(startDate) {
  if (!startDate || !isValidDate(startDate)) {
    return {
      isValid: false,
      error: "Complete o verifique el campo de fecha de inicio.",
    };
  }
  return { isValid: true };
}

export function validateSelectedDays(selectedDays) {
  if (
    selectedDays.length <= 0 ||
    !selectedDays.every((day) => DAYS_OF_WEEK.includes(day))
  ) {
    return {
      isValid: false,
      error: "Seleccione los dias de agendamiento de las clases.",
    };
  }
  return { isValid: true };
}

export function validateSchedule(times, selectedDays) {
  if (
    !validateScheduleTimes(times) ||
    !(selectedDays.length === Object.keys(times).length)
  ) {
    return {
      isValid: false,
      error: "Seleccione las horas de agendamiento.",
    };
  }
  return { isValid: true };
}
