import { COLORS } from "./colorsStatusLesson";
import { FormattedDate } from "./formattedDate";

//TODO: meter colores en variables
const statusLesson = (lesson, rol) => {
  if (!lesson) {
    return [COLORS.FUCHSIA_BG, COLORS.FUCHSIA_TEXT, "Unknown Status"];
  }

  if (lesson.isCanceled) {
    return [COLORS.RED_BG, COLORS.RED_TEXT, "Canceled"]; //RED
  }

  if (rol === "student") {
    if (lesson?.isScheduled && lesson?.isConfirmed && !lesson?.isStudentPaid) {
      return [
        COLORS.YELLOW_BG,
        COLORS.YELLOW_TEXT,
        "Finalizada - Pendiente De Pago",
      ]; //YELLOW
    }
    if (lesson?.isScheduled && lesson?.isConfirmed && lesson?.isStudentPaid) {
      return [COLORS.GREEN_BG, COLORS.GREEN_TEXT, "Finalizada - Pagada"]; //Green
    }
    if (lesson?.isScheduled && lesson?.isStudentPaid) {
      return [COLORS.BLUE_BG, COLORS.BLUE_TEXT, "Agendada - Pagada"]; //BLUE
    }
    if (lesson?.isScheduled && !lesson?.isStudentPaid) {
      return [COLORS.BLUE_BG, COLORS.BLUE_TEXT, "Agendada - Pendiente De Pago"]; //BLUE
    }
  }

  if (rol === "teacher") {
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid
    ) {
      return [COLORS.GREEN_BG, COLORS.GREEN_TEXT, "Registrada - Pagada"]; //GREEN
    }

    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      !lesson?.isTeacherPaid
    ) {
      return [
        COLORS.ORANGE_BG,
        COLORS.ORANGE_TEXT,
        "Registrada - Pendiente De Pago",
      ]; //ORANGE
    }

    if (lesson?.isScheduled && lesson?.isConfirmed) {
      return [COLORS.PURPLE_BG, COLORS.PURPLE_TEXT, "Clase Confirmada"]; //PURPLE
    }

    if (lesson?.isScheduled) {
      return [COLORS.BLUE_BG, COLORS.BLUE_TEXT, "Scheduled"]; //BLUE
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
        COLORS.ORANGE_BG,
        COLORS.ORANGE_TEXT,
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
        COLORS.ORANGE_BG,
        COLORS.ORANGE_TEXT,
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
        COLORS.YELLOW_BG,
        COLORS.YELLOW_TEXT,
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
        COLORS.GREEN_BG,
        COLORS.GREEN_TEXT,
        "Registrada - Pago Realizado Al Profesor - Pago Realizado Por Estudiante",
      ]; //GREEN
    }

    if (lesson?.isScheduled && lesson?.isConfirmed && !lesson?.isStudentPaid) {
      return [
        COLORS.PURPLE_BG,
        COLORS.PURPLE_TEXT,
        "Clase Confirmada - Pendiente Pago Estudiante",
      ]; //PURPLE
    }
    if (lesson?.isScheduled && lesson?.isConfirmed && lesson?.isStudentPaid) {
      return [
        COLORS.PURPLE_BG,
        COLORS.PURPLE_TEXT,
        "Clase Confirmada - Pago Realizado Por Estudiante",
      ]; //PURPLE
    }
    if (lesson?.isScheduled && !lesson?.isStudentPaid) {
      return [
        COLORS.BLUE_BG,
        COLORS.BLUE_TEXT,
        "Agendada - Pendiente Pago Estudiante",
      ]; //BLUE
    }
    if (lesson?.isScheduled && lesson?.isStudentPaid) {
      return [
        COLORS.BLUE_BG,
        COLORS.BLUE_TEXT,
        "Agendada - Pago Realizado Por Estudiante",
      ]; //BLUE
    }
  }

  return [COLORS.FUCHSIA_BG, COLORS.FUCHSIA_TEXT, "Unknown Status"];
};

export function FormattedLessonsForCalendar(original_lesson, rol) {
  if (!original_lesson || original_lesson.length <= 0) {
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
