"use server";
import prisma from "@/lib/prisma";
import { RequestResponse } from "@/utils/requestResponse";
import {
  formatAndValidateStudents,
  validatePeriodOfTime,
  validateSchedule,
  validateSelectedDays,
  validateStartDate,
  validateStudents,
  validateTeacher,
  formatAndValidateteacher,
} from "@/utils/lessonCrudValidations";
import { scheduleLessons } from "@/utils/scheduleLessons";
import { auth } from "@/auth";
import moment from "moment";

const formattedLessonForBD = (form_data) => {
  // TODO Mirar como adtener los de mas datos del formulario
  const lesson_formated = Object.fromEntries(form_data.entries());
  if (lesson_formated.isGroup)
    lesson_formated.isGroup = Boolean(lesson_formated.isGroup);
  if (lesson_formated.isStudentPaid)
    lesson_formated.isStudentPaid = Boolean(
      parseInt(lesson_formated.isStudentPaid, 10)
    );
  if (lesson_formated.isTeacherPaid)
    lesson_formated.isTeacherPaid = Boolean(
      parseInt(lesson_formated.isTeacherPaid, 10)
    );
  if (lesson_formated.isRegistered)
    lesson_formated.isRegistered = Boolean(lesson_formated.isRegistered);
  if (lesson_formated.teacherPayment)
    lesson_formated.teacherPayment = parseFloat(lesson_formated.teacherPayment);
  if (lesson_formated.studentFee)
    lesson_formated.studentFee = parseFloat(lesson_formated.studentFee);
  return lesson_formated;
};

export async function CreateNewLesson(prev_state, lessons_data) {
  try {
    const { students, teacher, periodOfTime, startDate, selectedDays, times } =
      lessons_data;

    const validations = [
      await validateStudents(students),
      await validateTeacher(teacher),
      await validatePeriodOfTime(periodOfTime),
      await validateStartDate(startDate),
      await validateSelectedDays(selectedDays),
      await validateSchedule(times, selectedDays),
    ];

    // Verificar si hay errores
    const validationError = validations.find((v) => !v.isValid);
    if (validationError) {
      return RequestResponse.error(validationError.error);
    }

    // verificaciones de users y formating
    const students_formated = await formatAndValidateStudents(students);
    if (!students_formated.isValid) {
      return RequestResponse.error(students_formated.error);
    }
    const { data: data_students } = students_formated;

    const teacher_formated = await formatAndValidateteacher(teacher);
    if (!students_formated.isValid) {
      return RequestResponse.error(students_formated.error);
    }
    const { data: data_teacher } = teacher_formated;

    const all_date = scheduleLessons(
      selectedDays,
      times,
      periodOfTime,
      startDate
    );

    const lesson = {
      teacherId: data_teacher.teacherId,
      teacherPayment: data_teacher.teacherPayment,
    };

    const data = all_date.map((date) => ({
      ...lesson,
      isGroup: data_students.length > 1,
      startDate: date,
      studentLessons: {
        create: data_students,
      },
    }));

    const new_lessons = await prisma.$transaction(
      data.map((lesson_data) =>
        prisma.lesson.create({
          data: {
            ...lesson_data,
          },
          include: {
            teacher: true,
            studentLessons: {
              include: {
                student: true,
              },
            },
          },
        })
      )
    );
    return RequestResponse.success(new_lessons);
  } catch (error) {
    console.error("Error Crating and Scheduling lessons:", error);
    return RequestResponse.error();
  }
}

export async function getLessons() {
  try {
    const { user } = await auth();

    if (!user) {
      return RequestResponse.error();
    }

    const where_clause = {};
    if (!user.role.includes("admin")) {
      if (user.role.includes("student")) {
        where_clause.studentLessons = {
          some: {
            studentId: parseInt(user.id, 10),
          },
        };
      }
      if (user.role.includes("teacher")) {
        where_clause.teacherId = parseInt(user.id, 10);
      }
    }

    const lessons = await prisma.lesson.findMany({
      where: where_clause,
      include: {
        teacher: true, // Incluir información del profesor si es necesario
        studentLessons: {
          include: {
            student: true,
          },
        },
      },
      orderBy: {
        startDate: "asc", // Ordenar por startDate en orden ascendente (de más antigua a más nueva)
      },
    });

    if (!lessons) return [];
    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function updateLesson(id, updated_lesson) {
  const updated_lesson_formated = formattedLessonForBD(updated_lesson);
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: updated_lesson_formated,
    });
  } catch (error) {
    console.error("Error Updating Lesson", error);
  }
}

export async function CancelLesson(id, value) {
  try {
    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        isCanceled: value,
      },
    });
  } catch (error) {
    console.error("error database", error);
  }
}

export async function rescheduleLesson(data_form) {
  try {
    const { id, startDate, reasonsRescheduled } = data_form;
    if (!id || !startDate) {
      return RequestResponse.error();
    }

    const lesson_exits = await prisma.lesson.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        reasonsRescheduled: true,
      },
    });

    if (!lesson_exits) {
      return RequestResponse.error();
    }

    const reasons_current = lesson_exits.reasonsRescheduled || "";
    const reschedule_reason = reasonsRescheduled
      ? `$& ${reasonsRescheduled}`
      : "";
    const date_formatted = moment().format("D-M-Y");

    const reasons_rescheduled_formated = `${reasons_current} $% ${date_formatted} ${reschedule_reason}`;

    await prisma.lesson.update({
      where: {
        id,
      },
      data: {
        startDate,
        isRescheduled: true,
        reasonsRescheduled: reasons_rescheduled_formated,
      },
    });

    return RequestResponse.success();
  } catch (error) {
    console.error("Error Reschedule lessons:", error);
    return RequestResponse.error();
  }
}

export async function unpaidLessons(
  user_id,
  start_date_string,
  end_date_string
) {
  try {
    if (start_date_string.length <= 0) {
      return RequestResponse.error("Por favor ingrese la fecha de inicio.");
    }
    if (end_date_string.length <= 0) {
      return RequestResponse.error("Por favor ingrese la fecha final.");
    }

    const start_date = new Date(start_date_string).toISOString();
    const end_date = new Date(end_date_string).toISOString();

    if (start_date > end_date) {
      return RequestResponse.error(
        "La fecha de busqueda de inicio debe ser menor a la fecha final."
      );
    }

    if (!user_id) {
      return RequestResponse.error("Por favor seleccione un usuario.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return RequestResponse.error();
    }

    const filters = {};

    if (user.role.includes("teacher")) filters.isRegistered = true;

    const unpaid_lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          {
            // Filtro para encontrar lecciones donde el estudiante no ha pagado
            studentLessons: {
              some: {
                isStudentPaid: false,
                student: {
                  id: user_id,
                },
              },
            },
          },
          {
            // Filtro para encontrar lecciones donde el profesor no ha sido pagado
            teacherId: user_id,
            isTeacherPaid: false,
          },
        ],
        startDate: {
          gte: start_date,
          lte: end_date,
        },
        isCanceled: false,
        ...filters,
      },
      include: {
        teacher: true, // Incluir información del profesor
        studentLessons: {
          include: {
            student: true, // Incluir información del estudiante en las lecciones
          },
        },
      },
      orderBy: {
        startDate: "asc", // Ordenar por startDate en orden ascendente (de más antigua a más nueva)
      },
    });
    return RequestResponse.success(unpaid_lessons);
  } catch (error) {
    console.error("Error Getting Unpaid Lessons", error);
    return RequestResponse.error();
  }
}

export async function DeleteLesson(ids) {
  try {
    await prisma.lesson.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error("Error Unpaying Lesson", error);
  }
}

export async function overViewLessonTeacher(id) {
  try {
    if (!id) return RequestResponse.error();

    const id_formated = parseInt(id, 10);

    const teacher = await prisma.user.findFirst({
      where: {
        id: id_formated,
        role: {
          has: "teacher",
        },
      },
      select: {
        averageScore: true,
      },
    });
    let data = {
      averageScore: 0,
      completed: 0,
      scheduled: 0,
      debt: 0,
    };
    if (!teacher) return RequestResponse.error();

    data.averageScore = Math.min(Math.ceil(teacher.averageScore + 0.5), 10);

    const teacherLessonsData = await prisma.user.findUnique({
      where: { id: id_formated },
      select: {
        teacherLessons: {
          select: {
            id: true,
            isScheduled: true,
            isConfirmed: true,
            isRegistered: true,
            isTeacherPaid: true,
            teacherPayment: true,
          },
        },
      },
    });

    if (teacherLessonsData) {
      const completedLessons = teacherLessonsData.teacherLessons.filter(
        (lesson) =>
          lesson.isScheduled && lesson.isConfirmed && lesson.isRegistered
      ).length;

      const scheduledLessons = teacherLessonsData.teacherLessons.filter(
        (lesson) =>
          lesson.isScheduled && !lesson.isConfirmed && !lesson.isRegistered
      ).length;

      const unpaidLessons = teacherLessonsData.teacherLessons.filter(
        (lesson) => lesson.isRegistered && !lesson.isTeacherPaid
      );

      const totalDebt = unpaidLessons.reduce(
        (sum, lesson) => sum + (lesson.teacherPayment || 0),
        0
      );

      data.completed = completedLessons;
      data.debt = totalDebt;
      data.scheduled = scheduledLessons;
    }

    return RequestResponse.success(data);
  } catch (error) {
    console.error("Error in overViewLessonTeacher()", error);
    return RequestResponse.error();
  }
}

export async function overViewLessonStudent(id) {
  try {
    if (!id) return RequestResponse.error();

    const id_formated = parseInt(id, 10);

    const student = await prisma.user.findFirst({
      where: {
        id: id_formated,
        role: {
          has: "student",
        },
      },
      select: {
        averageScore: true,
      },
    });
    if (!student) return RequestResponse.error();

    const student_lessons_data = await prisma.user.findUnique({
      where: { id: id_formated },
      select: {
        studentLessons: {
          select: {
            isStudentPaid: true,
            isConfirmed: true,
            studentFee: true,
            lesson: {
              select: {
                isRegistered: true,
                isScheduled: true,
              },
            },
          },
        },
      },
    });

    let data = {
      completed: 0,
      scheduled: 0,
      debt: 0,
    };

    if (student_lessons_data) {
      const completedLessons = student_lessons_data.studentLessons.filter(
        (sl) => sl.lesson.isScheduled && sl.isConfirmed
      ).length;

      const scheduledLessons = student_lessons_data.studentLessons.filter(
        (sl) =>
          sl.lesson.isScheduled && !sl.isConfirmed && !sl.lesson.isRegistered
      ).length;

      const unpaidLessons = student_lessons_data.studentLessons.filter(
        (sl) => sl.isConfirmed && !sl.isStudentPaid
      );

      const totalDebt = unpaidLessons.reduce(
        (sum, sl) => sum + (sl.studentFee || 0),
        0
      );

      data.completed = completedLessons;
      data.scheduled = scheduledLessons;
      data.debt = totalDebt;
    }

    return RequestResponse.success(data);
  } catch (error) {
    console.error("Error in overViewLessonTeacher()", error);
    return RequestResponse.error();
  }
}

export async function dataDashboard() {
  try {
    // Lessons stats
    const scheduledLessons = await prisma.lesson.count({
      where: {
        isScheduled: true,
        isConfirmed: false,
      },
    });

    const unpaidTeacherLessons = await prisma.lesson.count({
      where: {
        isRegistered: true,
        isTeacherPaid: false,
      },
    });

    const unpaidStudentLessons = await prisma.studentLesson.count({
      where: {
        isConfirmed: true,
        isStudentPaid: false,
      },
    });

    // User stats
    const teacherCount = await prisma.user.count({
      where: {
        role: {
          has: "teacher",
        },
      },
    });

    const studentCount = await prisma.user.count({
      where: {
        role: {
          has: "student",
        },
      },
    });

    return RequestResponse.success({
      scheduledLessons,
      unpaidTeacherLessons,
      unpaidStudentLessons,
      teacherCount,
      studentCount,
    });
  } catch (error) {
    console.error("Error in dataDashboard()", error);
    return RequestResponse.error();
  }
}
