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
  validateDates,
} from "@/utils/lessonCrudValidations";
import { auth } from "@/auth";
import moment from "moment";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";

export async function CreateNewLesson(prev_state, lessons_data) {
  try {
    const {
      students,
      teacher,
      periodOfTime,
      startDate,
      selectedDays,
      times,
      allDates,
    } = lessons_data;

    const validations = [
      await validateStudents(students),
      await validateTeacher(teacher),
      await validatePeriodOfTime(periodOfTime),
      await validateStartDate(startDate),
      await validateSelectedDays(selectedDays),
      await validateSchedule(times, selectedDays),
      await validateDates(allDates),
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
    if (!teacher_formated.isValid) {
      return RequestResponse.error(teacher_formated.error);
    }
    const { data: data_teacher } = teacher_formated;

    const lesson = {
      teacherId: data_teacher.teacherId,
      teacherPayment: data_teacher.teacherPayment,
    };

    const data = allDates.map((date) => ({
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
      select: {
        id: true,
        startDate: true,
        topic: true,
        issues: true,
        week: true,
        teacherObservations: true,
        otherObservations: true,
        isPaid: true,
        isScheduled: true,
        isRescheduled: true,
        isCanceled: true,
        isConfirmed: true,
        isGroup: true,
        isRegistered: true,
        teacherPayment: true,
        isTeacherPaid: true,
        reasonsRescheduled: true,
        profit: true,
        teacherId: true,
        teacher: {
          select: {
            id: true,
            fullName: true,
            shortName: true,
            email: true,
            averageScore: true,
          },
        },
        studentLessons: {
          select: {
            id: true,
            isStudentPaid: true,
            studentFee: true,
            lessonScore: true,
            studentObservations: true,
            isConfirmed: true,
            studentId: true,
            student: {
              select: {
                id: true,
                fullName: true,
                shortName: true,
                email: true,
              },
            },
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

/**
 * Fetches lessons based on the provided filters.
 * @param {Object} filters - Object containing teacherId, studentId, startDate, and/or endDate.
 * @returns {Promise<Array>} A list of lessons matching the filters.
 */
export async function getLessonsByFilters(prev, filters) {
  try {
    const { teacherId, studentId, startDate, endDate } = filters;

    if (!startDate && !endDate) {
      return RequestResponse.error("Por favor introdusca un rango de fecha.");
    }

    if (startDate > endDate) {
      return RequestResponse.error(
        "La fecha de inicio debe ser menor a la fecha final."
      );
    }

    // Construct dynamic Prisma query filters
    const where = {
      AND: [{ isConfirmed: false }],
    };

    // Add condition for all studentLessons having isStudentPaid as false
    where.AND.push({
      studentLessons: {
        every: {
          isStudentPaid: false,
        },
      },
    });

    if (teacherId) {
      where.AND.push({ teacherId });
    }

    if (studentId) {
      where.AND.push({
        studentLessons: {
          some: {
            studentId,
          },
        },
      });
    }

    if (startDate || endDate) {
      where.AND.push({
        startDate: {
          ...(startDate
            ? { gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)) }
            : {}),
          ...(endDate
            ? { lte: new Date(new Date(endDate).setHours(23, 59, 59, 0)) }
            : {}),
        },
      });
    }

    if (where.AND.length === 0) {
      delete where.AND; // Remove unnecessary AND if no filters
    }

    // Query lessons from the database
    const lessons = await prisma.lesson.findMany({
      where,
      select: {
        id: true,
        startDate: true,
        isGroup: true,
        isScheduled: true,
        isCanceled: true,
        isRegistered: true,
        isTeacherPaid: true,
        teacher: {
          select: {
            shortName: true,
          },
        },
        studentLessons: {
          select: {
            id: true,
            studentId: true,
            isStudentPaid: true,
            student: {
              select: {
                shortName: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return RequestResponse.success(lessons);
  } catch (error) {
    console.error("Error in getLessonsByFilters()", error);
    return RequestResponse.error();
  }
}

export async function updateLesson(prev, updated_lesson_data) {
  try {
    const {
      lessonId,
      students,
      teacher,
      week,
      topic,
      teacherObservations,
      issues,
      otherObservations,
    } = updated_lesson_data;

    const validations = [
      await validateStudents(students),
      await validateTeacher(teacher),
    ];

    const validationError = validations.find((v) => !v.isValid);
    if (validationError) {
      return RequestResponse.error(validationError.error);
    }

    const students_formated = await formatAndValidateStudents(students);
    if (!students_formated.isValid) {
      return RequestResponse.error(students_formated.error);
    }
    const { data: data_students } = students_formated;

    const teacher_formated = await formatAndValidateteacher(teacher);
    if (!teacher_formated.isValid) {
      return RequestResponse.error(teacher_formated.error);
    }
    const { data: data_teacher } = teacher_formated;

    const lesson_current = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        teacher: true,
        studentLessons: {
          include: {
            student: true,
          },
        },
      },
    });
    if (!lesson_current) {
      throw new Error("Field problem !lesson");
    }

    let data = {};

    // Identificar estudiantes a agregar
    const students_data_current = lesson_current.studentLessons.map(
      (student_lesson) => ({
        fee: student_lesson.studentFee,
        studentId: student_lesson.studentId,
      })
    );
    const students_data = students.map((student) => ({
      fee: parseCurrencyToNumber(student.fee),
      studentId: student.student.id,
    }));

    const students_to_add = students_data.filter(
      (newStudent) =>
        !students_data_current.some(
          (current) => current.studentId === newStudent.studentId
        )
    );

    // Identificar estudiantes a eliminar
    const students_to_remove = students_data_current.filter(
      (current) =>
        !students_data.some(
          (newStudent) => newStudent.studentId === current.studentId
        )
    );

    // Identificar estudiantes a actualizar
    const students_to_update = students_data.filter((newStudent) =>
      students_data_current.some(
        (current) =>
          current.studentId === newStudent.studentId &&
          current.fee !== newStudent.fee
      )
    );

    if (
      students_to_add.length > 0 ||
      students_to_remove.length > 0 ||
      students_to_update.length > 0
    ) {
      await prisma.$transaction([
        // Agregar nuevos estudiantes
        ...students_to_add.map((student) =>
          prisma.studentLesson.create({
            data: {
              lessonId,
              studentId: student.studentId,
              studentFee: student.fee,
            },
          })
        ),

        // Eliminar estudiantes
        ...students_to_remove.map((student) =>
          prisma.studentLesson.delete({
            where: {
              studentId_lessonId: {
                studentId: student.studentId,
                lessonId,
              },
            },
          })
        ),

        // Actualizar estudiantes
        ...students_to_update.map((student) =>
          prisma.studentLesson.update({
            where: {
              studentId_lessonId: {
                studentId: student.studentId,
                lessonId,
              },
            },
            data: {
              studentFee: student.fee,
            },
          })
        ),
      ]);
    }

    if (
      data_teacher.teacherId !== lesson_current.teacherId &&
      !lesson_current.isRegistered
    ) {
      data.teacherId = data_teacher.teacherId;
      data.teacherPayment = data_teacher.teacherPayment;
    }
    if (
      data_teacher.teacherId === lesson_current.teacherId &&
      data_teacher.teacherPayment !== lesson_current.teacherPayment
    ) {
      data.teacherPayment = data_teacher.teacherPayment;
      if (lesson_current.isRegistered) {
        await prisma.debt.updateMany({
          where: {
            lessonId: lesson_current.id,
            userId: lesson_current.teacherId,
          },
          data: {
            amount: data_teacher.teacherPayment,
          },
        });
      }
    }
    if (
      lesson_current.isRegistered &&
      (!week || !topic || !teacherObservations)
    ) {
      return RequestResponse.error(
        "Por favor complete los campos de observaciones."
      );
    }

    if (week && week !== lesson_current.week) {
      data.week = week;
    }
    if (topic && topic !== lesson_current.topic) {
      data.topic = topic;
    }
    if (
      teacherObservations &&
      teacherObservations !== lesson_current.teacherObservations
    ) {
      data.teacherObservations = teacherObservations;
    }
    if (issues && issues !== lesson_current.issues) {
      data.issues = issues;
    }
    if (
      otherObservations &&
      otherObservations !== lesson_current.otherObservations
    ) {
      data.otherObservations = otherObservations;
    }

    data.isGroup = students_data.length > 1;

    // console.log(data);
    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        ...data,
      },
    });
    return RequestResponse.success();
  } catch (error) {
    console.error("Error updateLesson()", error);
    return RequestResponse.error();
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
        "La fecha de inicio debe ser menor a la fecha final."
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

export async function deleteLessons(prev, ids) {
  try {
    await prisma.$transaction([
      prisma.studentLesson.deleteMany({
        where: {
          lessonId: {
            in: ids,
          },
        },
      }),
      prisma.lesson.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      }),
    ]);
    return RequestResponse.success();
  } catch (error) {
    console.error("Error in deleteLesson()", error);
    return RequestResponse.error();
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
      averageScoreReal: 0,
    };
    if (!teacher) return RequestResponse.error();

    data.averageScore = Math.min(Math.ceil(teacher.averageScore + 0.6), 10);

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
      data.averageScoreReal = teacher.averageScore;
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
