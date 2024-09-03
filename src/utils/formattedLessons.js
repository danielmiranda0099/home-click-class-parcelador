import { FormattedDate } from "./formattedDate";

//TODO: meter colores en variables
const statusLesson = (lesson, rol) => {
  if (!lesson) {
    return ["#ff00ff", "white", "Unknown Status"];
  }

  if (lesson.is_canceled) {
    return ["#ef233c", "white", "Canceled"]; //RED
  }

  if (rol === "student") {
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      !lesson?.is_student_paid
    ) {
      return ["#FFF68A", "#8B8000", "Finalizada - Pendiente De Pago"]; //YELLOW
    }
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_student_paid
    ) {
      return ["#98FFB3", "#006622", "Finalizada - Pagada"]; //Green
    }
    if (lesson?.is_scheduled && lesson?.is_student_paid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pagada"]; //BLUE
    }
    if (lesson?.is_scheduled && !lesson?.is_student_paid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pendiente De Pago"]; //BLUE
    }
  }

  if (rol === "teacher") {
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      lesson?.is_teacher_paid
    ) {
      return ["#98FFB3", "#006622", "Registrada - Pagada"]; //GREEN
    }

    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      !lesson?.is_teacher_paid
    ) {
      return ["#FFB38A", "#8B4000", "Registrada - Pendiente De Pago"]; //ORANGE
    }

    if (lesson?.is_scheduled && lesson?.is_confirmed) {
      return ["#C5A3FF", "#3A0070", "Clase Confirmada"]; //PURPLE
    }

    if (lesson?.is_scheduled) {
      return ["#8AE2FF", "#005F7F", "Scheduled"]; //BLUE
    }
  }

  if (rol === "admin") {
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      !lesson?.is_teacher_paid &&
      !lesson?.is_student_paid
    ) {
      return [
        "#FFB38A",
        "#8B4000",
        "Registrada - Pendiente Pago Profesor - Pendiente Pago Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      !lesson?.is_teacher_paid &&
      lesson?.is_student_paid
    ) {
      return [
        "#FFB38A",
        "#8B4000",
        "Registrada - Pendiente Pago Profesor - Pago Realizado Por Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      lesson?.is_teacher_paid &&
      !lesson?.is_student_paid
    ) {
      return [
        "#FFF68A",
        "#8B8000",
        "Registrada - Pago Realizado Al Profesor - Pendiente Pago Estudiante",
      ]; //YELLOW
    }
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_registered &&
      lesson?.is_teacher_paid &&
      lesson?.is_student_paid
    ) {
      return [
        "#98FFB3",
        "#006622",
        "Registrada - Pago Realizado Al Profesor - Pago Realizado Por Estudiante",
      ]; //GREEN
    }

    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      !lesson?.is_student_paid
    ) {
      return [
        "#C5A3FF",
        "#3A0070",
        "Clase Confirmada - Pendiente Pago Estudiante",
      ]; //PURPLE
    }
    if (
      lesson?.is_scheduled &&
      lesson?.is_confirmed &&
      lesson?.is_student_paid
    ) {
      return [
        "#C5A3FF",
        "#3A0070",
        "Clase Confirmada - Pago Realizado Por Estudiante",
      ]; //PURPLE
    }
    if (lesson?.is_scheduled && !lesson?.is_student_paid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pendiente Pago Estudiante"]; //BLUE
    }
    if (lesson?.is_scheduled && lesson?.is_student_paid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pago Realizado Por Estudiante"]; //BLUE
    }
  }

  return ["#ff00ff", "white", "Unknown Status"];
};

export function FormattedLessons(original_lesson, rol) {
  if (!original_lesson) {
    return [];
  }
  if (original_lesson.length <= 0) {
    return [];
  }
  return original_lesson.map((lesson) => {
    const [background, color, lesson_status] = statusLesson(lesson, rol);
    return {
      id: lesson.id,
      title: lesson.students || "UNKNOW",
      start: new Date(FormattedDate(lesson.start_date)),
      end: new Date(FormattedDate(lesson.start_date, true)),
      background,
      color,
      lesson_status,
      ...lesson,
    };
  });
}
