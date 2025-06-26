"use server";
import { auth } from "@/auth";
import { COLORS } from "./colorsStatusLesson";
export async function statusLesson(lesson, rol) {
  const session = await auth();
  if (!lesson) {
    return [COLORS.FUCHSIA_BG, COLORS.FUCHSIA_TEXT, "Unknown Status"];
  }

  if (lesson.isCanceled) {
    return [COLORS.RED_BG, COLORS.RED_TEXT, "Canceled"]; //RED
  }

  if (rol === "student") {
    if (
      lesson?.isScheduled &&
      lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isConfirmed &&
      !lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isStudentPaid
    ) {
      return [
        COLORS.YELLOW_BG,
        COLORS.YELLOW_TEXT,
        "Finalizada - Pendiente De Pago",
      ]; //YELLOW
    }
    if (
      lesson?.isScheduled &&
      lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isConfirmed &&
      lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isStudentPaid
    ) {
      return [COLORS.GREEN_BG, COLORS.GREEN_TEXT, "Finalizada - Pagada"]; //Green
    }
    if (
      lesson?.isScheduled &&
      lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isStudentPaid
    ) {
      return [COLORS.BLUE_BLACK_BG, COLORS.WHITE, "Agendada - Pagada"]; //BLUE
    }
    if (
      lesson?.isScheduled &&
      !lesson?.studentLessons.find(
        (student_lesson) =>
          student_lesson.studentId === parseInt(session?.user?.id, 10)
      ).isStudentPaid
    ) {
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
      !lesson?.studentLessons.some((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.ORANGE_BG,
        COLORS.ORANGE_TEXT,
        lesson?.isGroup
          ? "Registrada"
          : "Registrada - Pendiente Pago Profesor - Pendiente Pago Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      !lesson?.isTeacherPaid &&
      lesson?.studentLessons.some((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.ORANGE_BG,
        COLORS.ORANGE_TEXT,
        lesson?.isGroup
          ? "Registrada"
          : "Registrada - Pendiente Pago Profesor - Pago Realizado Por Estudiante",
      ]; //ORANGE
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid &&
      lesson?.studentLessons.some((lesson) => !lesson.isStudentPaid)
    ) {
      return [
        COLORS.YELLOW_BG,
        COLORS.YELLOW_TEXT,
        lesson?.isGroup
          ? "Registrada"
          : "Registrada - Pago Realizado Al Profesor - Pendiente Pago Estudiante",
      ]; //YELLOW
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      lesson?.isRegistered &&
      lesson?.isTeacherPaid &&
      lesson?.studentLessons.every((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.GREEN_BG,
        COLORS.GREEN_TEXT,
        "Pagos hechos, clase finalizada",
      ]; //GREEN
    }

    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      !lesson?.isRegistered &&
      !lesson?.studentLessons.some((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.PURPLE_BG,
        COLORS.PURPLE_TEXT,
        lesson?.isGroup
          ? "Clase Confirmada"
          : "Clase Confirmada - Pendiente Pago Estudiante",
      ]; //PURPLE
    }
    if (
      lesson?.isScheduled &&
      lesson?.isConfirmed &&
      !lesson?.isRegistered &&
      lesson?.studentLessons.some((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.PURPLE_BG,
        COLORS.PURPLE_TEXT,
        lesson?.isGroup
          ? "Clase Confirmada"
          : "Clase Confirmada - Pago Realizado Por Estudiante",
      ]; //PURPLE
    }
    if (
      lesson?.isScheduled &&
      !lesson?.studentLessons.every((lesson) => lesson.isStudentPaid)
    ) {
      return [COLORS.BLUE_BG, COLORS.BLUE_TEXT, "Agendada"]; //BLUE
    }
    if (
      lesson?.isScheduled &&
      lesson?.studentLessons.some((lesson) => lesson.isStudentPaid)
    ) {
      return [
        COLORS.BLUE_BLACK_BG,
        COLORS.WHITE,
        "Agendada - Pago Realizado Por Estudiante",
      ]; //BLUE
    }
  }

  return [COLORS.FUCHSIA_BG, COLORS.FUCHSIA_TEXT, "Unknown Status"];
}
