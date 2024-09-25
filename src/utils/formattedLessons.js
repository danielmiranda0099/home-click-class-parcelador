import { FormattedDate } from "./formattedDate";

//TODO: meter colores en variables
const statusLesson = (lesson, rol) => {
  if (!lesson) {
    return ["#ff00ff", "white", "Unknown Status"];
  }

  if (lesson.isCanceled) {
    return ["#ef233c", "white", "Canceled"]; //RED
  }

  if (rol === "student") {
    if (lesson?.isScheduled && lesson?.isConfirmed && !lesson?.isStudentPaid) {
      return ["#FFF68A", "#8B8000", "Finalizada - Pendiente De Pago"]; //YELLOW
    }
    if (lesson?.isScheduled && lesson?.isConfirmed && lesson?.isStudentPaid) {
      return ["#98FFB3", "#006622", "Finalizada - Pagada"]; //Green
    }
    if (lesson?.isScheduled && lesson?.isStudentPaid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pagada"]; //BLUE
    }
    if (lesson?.isScheduled && !lesson?.isStudentPaid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pendiente De Pago"]; //BLUE
    }
  }

  if (rol === "teacher") {
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid
    ) {
      return ["#98FFB3", "#006622", "Registrada - Pagada"]; //GREEN
    }

    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      !lesson?.isTeacherPaid
    ) {
      return ["#FFB38A", "#8B4000", "Registrada - Pendiente De Pago"]; //ORANGE
    }

    if (lesson?.isScheduled && lesson?.isConfirmed) {
      return ["#C5A3FF", "#3A0070", "Clase Confirmada"]; //PURPLE
    }

    if (lesson?.isScheduled) {
      return ["#8AE2FF", "#005F7F", "Scheduled"]; //BLUE
    }
  }

  if (rol === "admin") {
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      !lesson?.isTeacherPaid &&
      !lesson?.isStudentPaid
    ) {
      return [
        "#FFB38A",
        "#8B4000",
        "Registrada - Pendiente Pago Profesor - Pendiente Pago Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      !lesson?.isTeacherPaid &&
      lesson?.isStudentPaid
    ) {
      return [
        "#FFB38A",
        "#8B4000",
        "Registrada - Pendiente Pago Profesor - Pago Realizado Por Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid &&
      !lesson?.isStudentPaid
    ) {
      return [
        "#FFF68A",
        "#8B8000",
        "Registrada - Pago Realizado Al Profesor - Pendiente Pago Estudiante",
      ]; //YELLOW
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid &&
      lesson?.isStudentPaid
    ) {
      return [
        "#98FFB3",
        "#006622",
        "Registrada - Pago Realizado Al Profesor - Pago Realizado Por Estudiante",
      ]; //GREEN
    }

    if (lesson?.isScheduled && lesson?.isConfirmed && !lesson?.isStudentPaid) {
      return [
        "#C5A3FF",
        "#3A0070",
        "Clase Confirmada - Pendiente Pago Estudiante",
      ]; //PURPLE
    }
    if (lesson?.isScheduled && lesson?.isConfirmed && lesson?.isStudentPaid) {
      return [
        "#C5A3FF",
        "#3A0070",
        "Clase Confirmada - Pago Realizado Por Estudiante",
      ]; //PURPLE
    }
    if (lesson?.isScheduled && !lesson?.isStudentPaid) {
      return ["#8AE2FF", "#005F7F", "Agendada - Pendiente Pago Estudiante"]; //BLUE
    }
    if (lesson?.isScheduled && lesson?.isStudentPaid) {
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
      title: lesson.student.firstName + lesson.student.lastName || "UNKNOW",
      start: new Date(FormattedDate(lesson.startDate)),
      end: new Date(FormattedDate(lesson.startDate, true)),
      background,
      color,
      lesson_status,
      ...lesson,
    };
  });
}
